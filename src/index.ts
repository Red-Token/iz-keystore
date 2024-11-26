#!/usr/bin/env node

import yargs from "yargs";
import {hideBin} from "yargs/helpers";

yargs(hideBin(process.argv))
    .command(
        "greet [name]",
        "Greet the user by name",
        (yargs) => {
            return yargs.positional("name", {
                describe: "Name of the person to greet",
                type: "string",
                default: "World",
            });
        },
        (argv) => {
            console.log(`Hello, ${argv.name}!`);
        }
    )
    .help()
    .argv;
