import { TurbolinksTestCase } from "../lib/turbolinks_test_case"

class NavigationTests extends TurbolinksTestCase {
  async setup() {
    await this.goToLocation("/test/fixtures/navigation.html")
  }

  async "test after loading the page"() {
    this.assert.equal(await this.pathname, "/test/fixtures/navigation.html")
    this.assert.equal(await this.visitAction, "load")
  }

  async "test following a same-origin unannotated link"() {
    this.clickSelector("#same-origin-unannotated-link")
    await this.nextPageChange
    this.assert.equal(await this.pathname, "/test/fixtures/one.html")
    this.assert.equal(await this.visitAction, "advance")
  }

  async "test following a same-origin data-turbolinks-action=replace link"() {
    this.clickSelector("#same-origin-replace-link")
    await this.nextPageChange
    this.assert.equal(await this.pathname, "/test/fixtures/one.html")
    this.assert.equal(await this.visitAction, "replace")
  }

  async "test following a same-origin data-turbolinks=false link"() {
    this.clickSelector("#same-origin-false-link")
    await this.nextPageChange
    this.assert.equal(await this.pathname, "/test/fixtures/one.html")
    this.assert.equal(await this.visitAction, "load")
  }

  async "test following a same-origin unannotated link inside a data-turbolinks=false container"() {
    this.clickSelector("#same-origin-unannotated-link-inside-false-container")
    await this.nextPageChange
    this.assert.equal(await this.pathname, "/test/fixtures/one.html")
    this.assert.equal(await this.visitAction, "load")
  }

  async "test following a same-origin data-turbolinks=true link inside a data-turbolinks=false container"() {
    this.clickSelector("#same-origin-true-link-inside-false-container")
    await this.nextPageChange
    this.assert.equal(await this.pathname, "/test/fixtures/one.html")
    this.assert.equal(await this.visitAction, "advance")
  }

  async "test following a same-origin anchored link"() {
    this.clickSelector("#same-origin-anchored-link")
    await this.nextPageChange
    this.assert.equal(await this.pathname, "/test/fixtures/one.html")
    this.assert.equal(await this.hash, "#element-id")
    this.assert.equal(await this.visitAction, "advance")
    this.assert(await this.isScrolledToSelector("#element-id"))
  }

  async "test following a same-origin link to a named anchor"() {
    this.clickSelector("#same-origin-anchored-link-named")
    await this.nextPageChange
    this.assert.equal(await this.pathname, "/test/fixtures/one.html")
    this.assert.equal(await this.hash, "#named-anchor")
    this.assert.equal(await this.visitAction, "advance")
    this.assert(await this.isScrolledToSelector("[name=named-anchor]"))
  }

  async "test following a cross-origin unannotated link"() {
    this.clickSelector("#cross-origin-unannotated-link")
    await this.nextPageChange
    this.assert.equal(await this.location, "about:blank")
    this.assert.equal(await this.visitAction, "load")
  }

  async "test following a same-origin [target] link"() {
    this.clickSelector("#same-origin-targeted-link")
    this.remote.switchToWindow(await this.nextWindowHandle)
    this.assert.equal(await this.pathname, "/test/fixtures/one.html")
    this.assert.equal(await this.visitAction, "load")
  }

  async "test following a same-origin [download] link"() {
    this.clickSelector("#same-origin-download-link")
    this.assert(await this.pageNotChangedWithin(100/*ms*/))
    this.assert.equal(await this.pathname, "/test/fixtures/navigation.html")
    this.assert.equal(await this.visitAction, "load")
  }

  async "test following a same-origin link inside an SVG element"() {
    this.clickSelector("#same-origin-link-inside-svg-element")
    await this.nextPageChange
    this.assert.equal(await this.pathname, "/test/fixtures/one.html")
    this.assert.equal(await this.visitAction, "advance")
  }

  async "test following a cross-origin link inside an SVG element"() {
    this.clickSelector("#cross-origin-link-inside-svg-element")
    await this.nextPageChange
    this.assert.equal(await this.location, "about:blank")
    this.assert.equal(await this.visitAction, "load")
  }

  async "test clicking the back button"() {
    this.clickSelector("#same-origin-unannotated-link")
    await this.nextPageChange
    await this.goBack()
    this.assert.equal(await this.pathname, "/test/fixtures/navigation.html")
    this.assert.equal(await this.visitAction, "restore")
  }

  async "test clicking the forward button"() {
    this.clickSelector("#same-origin-unannotated-link")
    await this.nextPageChange
    await this.goBack()
    await this.goForward()
    this.assert.equal(await this.pathname, "/test/fixtures/one.html")
    this.assert.equal(await this.visitAction, "restore")
  }

  get location(): Promise<string> {
    return this.evaluate(() => location.toString())
  }

  get pathname(): Promise<string> {
    return this.evaluate(() => location.pathname)
  }

  get hash(): Promise<string> {
    return this.evaluate(() => location.hash)
  }
}

NavigationTests.registerSuite()
