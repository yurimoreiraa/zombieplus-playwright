const { expect } = require('@playwright/test')

export class Tvshows {

    constructor(page) {
        this.page = page
    }

    async goSeries() {
        await this.page.locator('a[href$="tvshows"]').click()
    }

    async goForm() {
        await this.page.locator('a[href$="register"]').click()
    }

    async submit() {
        await this.page.getByRole('button', { name: 'Cadastrar' }).click()

    }

    async create(tvshow) {

        await this.goSeries()
        await this.goForm()

        await this.page.locator('#title').fill(tvshow.title)
        await this.page.locator('#overview').fill(tvshow.overview)

        await this.page.locator('#select_company_id .react-select__indicator')
            .click()

        await this.page.locator('.react-select__option')
            .filter({ hasText: tvshow.company })
            .click()

        await this.page.locator('#select_year .react-select__indicators')
            .click()

        await this.page.locator('.react-select__option')
            .filter({ hasText: tvshow.release_year })
            .click()

        await this.page.locator('#seasons').fill(tvshow.season)

        await this.page.locator('#cover')
            .setInputFiles('tests/support/fixtures' + tvshow.cover)

        if (tvshow.featured) {
            await this.page.locator('.featured .react-switch').click()
        }

        await this.submit()
    }

    async search(target) {
        await this.goSeries()
        await this.page.getByPlaceholder('Busque pelo nome')
            .fill(target)

        await this.page.click('.actions button')
    }

    async tableHave(content) {
        await this.page.waitForSelector('.title')
        const elements = await this.page.locator('.title').allTextContents()
        const cleanedTitles = elements.map(title => title.replace(/\d+ Temporadas/, '').trim())
        expect(cleanedTitles).toEqual(content)
    }

    async alertHaveText(text) {
        const alert = this.page.locator('.alert')
        await expect(alert).toHaveText(text)
    }

    async remove(title) {
        await this.goSeries()
        await this.page.getByRole('row', { name: title }).getByRole('button').click()
        await this.page.click('.confirm-removal')
    }
}

