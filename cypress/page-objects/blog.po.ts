import { PageMetaObject } from "./meta.po";

export class BlogPageObject {
  meta = new PageMetaObject();

  visit() {
    cy.visit("/blog");
  }

  getTitle() {
    return cy.get("h1");
  }

  getBlogPosts() {
    return cy.get("article");
  }

  getRssLink() {
    return cy.get("a.rss");
  }
}
