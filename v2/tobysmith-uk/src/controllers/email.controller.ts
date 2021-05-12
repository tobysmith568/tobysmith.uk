import { Router, Request, Response } from "express";
import { ExpressService } from "src/services/express.service";
import { singleton } from "tsyringe";
import { IController } from "./controller.interface";

@singleton()
export class EmailController implements IController {
  private readonly router: Router;

  constructor(private readonly expressService: ExpressService) {
    this.router = this.expressService.createRouter();

    this.router.post("", (req, res) => this.sendMessage(req, res));
  }

  private async sendMessage(req: Request, res: Response): Promise<void> {
    console.log(req.body);

    res.json({ success: true });
  }

  public getRouter(): Router {
    return this.router;
  }
}
