import { parse, stringify } from 'jsr:@std/csv';

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
    let valuesArray = rows.map((row) => row.slice(7, 11));
    const values = valuesArray
      .slice(1)
      .map((row) => {
        return {
          metric_cd: row[0],
          attribute_1_txt: row[1],
          attribute_2_txt: row[2],
          value_txt: row[3],
        };
      })
      .filter((row) => row.attribute_1_txt !== 'Target');

    //    let metrics: string[] = []
    //
    //    values.forEach((row) => {
    //      if (!metrics.includes(row.metric_cd)) {
    //        metrics.push(row.metric_cd);
    //      }
    //    })
    //
    //    console.log(metrics)

    const output = Object.values(
      values.reduce((acc, row) => {
        // initialize accumulator for this metric if needed
        if (!acc[row.metric_cd]) {
          acc[row.metric_cd] = {
            metric_cd: row.metric_cd,
            // start with empty strings (or some default) for each role
            values: { DSM: '', RD: '', RMM: '', ZM: '' },
          };
        }
        // assign the value into the correct slot
        acc[row.metric_cd].values[row.attribute_2_txt] = row.value_txt;
        return acc;
      }, {}),
    );

    const date = new Date().toISOString();

    await Deno.writeTextFile(`${date}.json`, JSON.stringify({ output }));
    //console.log(rows.slice(0, 2).map((row) => row.slice(0)));
  } catch (e) {
    console.error(e);
  }
}
