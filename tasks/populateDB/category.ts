/* eslint-disable @typescript-eslint/no-explicit-any */
import { Category, generateAltColor, generateRandomColor } from '@autonomo/common';
import CategoryDB from '../../src/models/category';
import { getBusinessByName } from './business';
import { log } from './log';

type BusinessCategories = {
  business: string;
  categories: string[];
};

const getCategoriesByName = async (categories: string[]): Promise<Category[]> => {
  return await Promise.all(
    categories.map(async (categoryName): Promise<Category> => {
      return (await CategoryDB.findOne({ name: categoryName })) as Category;
    })
  );
};

const generateCategories = async (categories: any[]): Promise<void> => {
  const generateCategoriesForBusiness = async (businessCategories: BusinessCategories) => {
    const business = await getBusinessByName(businessCategories.business);
    const newCategories = await Promise.all(
      businessCategories.categories.map(async (category): Promise<Category> => {
        const color = generateRandomColor();
        const c = await CategoryDB.create({
          business: business._id,
          name: category,
          color,
          altColor: generateAltColor(color),
          type: 'invoice'
        });
        return c;
      })
    );

    log('Categories generated', newCategories.length, business.name);
  };

  for (const businessCategories of categories) {
    await generateCategoriesForBusiness(businessCategories);
  }
};

export { getCategoriesByName, generateCategories };
