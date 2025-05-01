import { parse, stringify } from "jsr:@std/csv";

main();

async function main() {
  const [filePath] = Deno.args;
  if (!filePath) {
    console.error('No file path provided');
    Deno.exit(1);
  }
  try {
    const csvText: string = await Deno.readTextFile(filePath);

    const rows = parse(csvText);

    console.log(rows)

  } catch (e) {
    console.error(e);
  }
}
