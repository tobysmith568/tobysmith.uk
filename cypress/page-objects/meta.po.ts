export class PageMetaObject {
  getTitle() {
    return cy
      .get("head title")
      .should("exist")
      .then(title => title.text());
  }

  getMetaDescription() {
    return cy
      .get('meta[name="description"]')
      .should("exist")
      .then(meta => meta.attr("content"));
  }
}
