import { ICommandInfo } from './command/parser';
import { helpCommandInfo } from './command/help';

import { receiveInt, receiveFloat, receiveWord } from './receivers';

export const rootCmd: ICommandInfo = {
  name: "'",
  following: '',
  help: "A root prefix.",
  child: [
    helpCommandInfo,
    {
      name: "inttest",
      child: [
        {
          name: "int0",
          receiver: receiveInt,
          executor: (_, msg, rec) => {
            msg.reply(rec?.get("int0"));
            return Promise.resolve({ success: true, message: rec?.get("int0") + " is what we got." })
          },
        },
      ],
    },
    {
      name: "floattest",
      child: [
        {
          name: "float0",
          receiver: receiveFloat,
          executor: (_, msg, rec) => {
            msg.reply(rec?.get("float0"));
            return Promise.resolve({ success: true, message: rec?.get("float0") + " is what we got." })
          },
        },
      ],
    },
    {
      name: "strtest",
      child: [
        {
          name: "str0",
          receiver: receiveWord,
          executor: (_, msg, rec) => {
            msg.reply(rec?.get("str0"));
            return Promise.resolve({ success: true, message: rec?.get("str0") + " is what we got." })
          },
          child: [
            {
              name: "reverse",
              executor: (_, msg, rec) => {
                msg.reply(rec?.get("str0").split('').reverse().join(''));
                return Promise.resolve({ success: true, message: rec?.get("str0") + " is what we got. But reversed." })
              },
            },
          ],
        },
      ],
    },
  ],
};

