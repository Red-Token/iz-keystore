#!/usr/bin/env node

import yargs from "yargs";
import {hideBin} from "yargs/helpers";
import {SignerType, SynchronisedSession} from "iz-nostrlib";
import {normalizeRelayUrl} from "@welshman/util";
import {setContext} from "@welshman/lib";
import {getDefaultAppContext, getDefaultNetContext} from "@welshman/app";
import {generateSecretKey, getPublicKey} from "nostr-tools";
import {nip19} from "nostr-tools";

yargs(hideBin(process.argv)).command(
    "greet [name]",
    "Greet the user by name",
    (yargs) => {
        return yargs.positional("name", {
            describe: "Name of the person to greet",
            type: "string",
            default: "World",
        });
    }, (argv) => {
        console.log(`Hello, ${argv.name}!`);

        handler(argv).then(() => console.log("The End!"))
    }
).help().argv;

async function handler(argv: yargs.ArgumentsCamelCase) {
    setContext({
        net: getDefaultNetContext(),
        app: getDefaultAppContext()
    })

    const sessionSecretKey = generateSecretKey()
    const sessionPublicKey = getPublicKey(sessionSecretKey)
    const sessionNSec = nip19.nsecEncode(sessionSecretKey)
    const sessionNPub = nip19.npubEncode(sessionPublicKey)

    const url = 'wss://relay.lxc'
    const keyRelays = [normalizeRelayUrl(url)]

    const keySession = await new SynchronisedSession({type: SignerType.NIP01, nsec: sessionNSec}, keyRelays).init()
}
