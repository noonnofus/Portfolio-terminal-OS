let ascii: string[] = [];

export default function chooseASCII(isTouch: boolean) {
  return (ascii = isTouch
    ? [
        // prettier-ignore
        "__ _  ____  _  _  __  __ _ ",
        // prettier-ignore
        "(  / )(  __)/ )( \\(  )(  ( \\",
        // prettier-ignore
        " )  (  ) _) \\ \\/ / )( /    /",
        // prettier-ignore
        "(__\\_)(____) \\__/ (__)(_)__)",
        ` `,
        ` `,
        ` `,
      ]
    : [
        // prettier-ignore
        " .-. .-')     ('-.        (`-.                .-') _  ",
        // prettier-ignore
        " \\  ( OO )  _(  OO)     _(OO  )_             ( OO ) ) ",
        // prettier-ignore
        " ,--. ,--. (,------.,--(_/   ,. \\ ,-.-') ,--./ ,--,'  ",
        // prettier-ignore
        " |  .'   /  |  .---'\\   \\   /(__/ |  |OO)|   \\ |  |\\  ",
        // prettier-ignore
        " |      /,  |  |     \\   \\ /   /  |  |  \\|    \\|  | ) ",
        // prettier-ignore
        " |     ' _)(|  '--.   \\   '   /,  |  |(_/|  .     |/  ",
        // prettier-ignore
        " |  .   \\   |  .--'    \\     /__),|  |_.'|  |\\    |   ",
        // prettier-ignore
        " |  |\\   \\  |  `---.    \\   /   (_|  |   |  | \\   |   ",
        // prettier-ignore
        " `--' '--'  `------'     `-'      `--'   `--'  `--'   ",
        ` `,
        ` `,
        ` `,
      ]);
}
