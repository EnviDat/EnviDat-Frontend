const META = {
  BASE_URL: (import.meta.env.PUBLIC_ENV__META__BASE_URL ?? 'http://localhost:3000') as string,
  DEFAULT_AUTHOR: (import.meta.env.PUBLIC_ENV__META__DEFAULT_AUTHOR ??
    'IT Team 4 Change') as string,
  DEFAULT_DESCRIPTION: (import.meta.env.PUBLIC_ENV__META__DEFAULT_DESCRIPTION ??
    `EnviDat provides research data from Switzerland and all over the world.
    The data is being provided by researchers of the many research units of the Swiss Federal Institute for Forest, Snow and Landscape WSL.`) as string,
  DEFAULT_TITLE: (import.meta.env.PUBLIC_ENV__META__DEFAULT_TITLE ?? 'Envidat - Environmental Research Data at your Fingertips') as string,
}

export { META }
