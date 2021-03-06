declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.less' {
  const classes: { [className: string]: string };
  export default classes;
}

declare module '*/settings.json' {
  const value: {
    colorWeek: boolean;
    navbar: boolean;
    menu: boolean;
    footer: boolean;
    themeColor: string;
    menuWidth: number;
    menuMode: number,
    menuAccordion: boolean
  };

  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}
