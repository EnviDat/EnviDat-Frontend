import {
  getWebpImagePathWithFallback,
} from '@/factories/enhancementsFactory';


describe('enhancementsFactory - getWebpImagePathWithFallback', () => {
  const targetExt = 'webp';

  it('empty', () => {

    const emptyInput = getWebpImagePathWithFallback(undefined);
    expect(emptyInput).toBe(null);
  });

  it('jpg with relative path with @ to modules', () => {

    const imageName = 'team_small';
    const imagePath = `@/modules/about/assets/${imageName}`;
    const imagePathWithExt = `${imagePath}.jpg`;
    const expectedImagePathWithExt = `${imagePath}.${targetExt}`;

    const webpRelative = getWebpImagePathWithFallback(imagePathWithExt, true);
    expect(webpRelative).toBe(expectedImagePathWithExt);
  });

  it('jpg with relative path in main assets folder ', () => {

    const imageName = 'app_b_browsepage';
    const imagePathWithExt = `./${imageName}.jpg`;
    const expectedImagePathWithExt = `./${imageName}.${targetExt}`;

    const webpRelative = getWebpImagePathWithFallback(imagePathWithExt, true);
    expect(webpRelative).toBe(expectedImagePathWithExt);
  });

  it('jpg with relative path in main assets folder (../src/assets)', () => {

    const imageName = 'team_small';
    const imagePath = `../modules/user/assets/${imageName}`;
    const imagePathWithExt = `${imagePath}.jpg`;
    const expectedImagePathWithExt = `${imagePath}.${targetExt}`;

    const webpRelative = getWebpImagePathWithFallback(imagePathWithExt, true);
    expect(webpRelative).toBe(expectedImagePathWithExt);
  });
  
});
