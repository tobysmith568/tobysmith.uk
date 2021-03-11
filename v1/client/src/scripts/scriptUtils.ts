export class ScriptUtils {

  private static hasErrored = false;

  public static startsection(sectionName: string) {
    console.log("\n", sectionName, "\n", "=".repeat(sectionName.length), "\n");
  }

  public static warn(message: string) {
    console.warn("\x1b[33m", message, "\x1b[0m");
  }

  public static error(message: string) {
    console.error("\x1b[31m", message, "\x1b[0m");
    ScriptUtils.hasErrored = true;
  }

  public static testFail() {
    if (ScriptUtils.hasErrored) {
      process.exit(1);
    }
  }
}
