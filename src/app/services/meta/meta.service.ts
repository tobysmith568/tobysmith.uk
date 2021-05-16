import { Inject, Injectable, Optional } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { RESPONSE } from "@nguniversal/express-engine/tokens";
import { Response } from "express";

@Injectable({
  providedIn: "root"
})
export class MetaService {
  constructor(
    private readonly titleService: Title,
    private readonly meta: Meta,
    @Optional() @Inject(RESPONSE) private response: Response<any> | undefined
  ) {}

  public statusCode(code: number = 200): MetaService {
    this.response?.status(code);
    return this;
  }

  public title(title: string): MetaService {
    if (!title || title.length === 0) {
      this.titleService.setTitle("Toby Smith");
      return this;
    }

    this.titleService.setTitle(`${title} - Toby Smith`);
    return this;
  }

  public description(description: string): MetaService {
    this.meta.updateTag({ name: "description", content: description });
    return this;
  }
}
