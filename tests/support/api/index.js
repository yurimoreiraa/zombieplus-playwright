import { Tvshows } from '../actions/Tvshows'
import fs from 'fs'
require('dotenv').config()
const { expect } = require('@playwright/test')

export class Api {

    constructor(request) {
        this.baseApi = process.env.BASE_API
        this.baseCover = process.env.BASE_COVER
        this.request = request
        this.token = undefined
    }

    async setToken() {
        const response = await this.request.post(this.baseApi + '/sessions', {
            data: {
                email: 'admin@zombieplus.com',
                password: 'pwd123'
            }
        })

        expect(response.ok()).toBeTruthy()
        const body = JSON.parse(await response.text())
        this.token = 'Bearer ' + body.token
    }

    async geyCompanyIdByName(companyName) {

        const response = await this.request.get(this.baseApi + '/companies', {
            headers: {
                Authorization: this.token,
            },
            params: {
                name: companyName
            }
        })

        expect(response.ok()).toBeTruthy()

        const body = JSON.parse(await response.text())
        return body.data[0].id
    }

    async postMovie(movie) {

        const companyId = await this.geyCompanyIdByName(movie.company)

        const response = await this.request.post(this.baseApi + '/movies', {
            headers: {
                Authorization: this.token,
                ContentType: 'multipart/form-data',
                Accept: 'application/json, text/plain, */*'
            },
            multipart: {
                title: movie.title,
                overview: movie.overview,
                company_id: companyId,
                release_year: movie.release_year,
                cover: fs.createReadStream(this.baseCover + movie.cover),
                featured: movie.featured
            }
        })

        expect(response.ok()).toBeTruthy()
    }

    async postTvshow(tvshow) {

        const companyId = await this.geyCompanyIdByName(tvshow.company)

        const response = await this.request.post(this.baseApi + '/tvshows', {
            headers: {
                Authorization: this.token,
                ContentType: 'multipart/form-data',
                Accept: 'application/json, text/plain, */*'
            },
            multipart: {
                title: tvshow.title,
                overview: tvshow.overview,
                company_id: companyId,
                release_year: tvshow.release_year,
                seasons: tvshow.season,
                cover: fs.createReadStream(this.baseCover + tvshow.cover),
                featured: tvshow.featured
            }
        })

        expect(response.ok()).toBeTruthy()
    }
}