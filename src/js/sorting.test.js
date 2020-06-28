import CompaniesData from './CompaniesData.js';


sortingTest('Testing sort function', () => {
});

jest.mock('./js/CompaniesData'); // CompaniesData is now a mock constructor

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  CompaniesData.mockClear();
});

it('We can check if the consumer called the class constructor', () => {
  const companiesData = new CompaniesData();
  expect(companiesData.sortResults('id', true, [
      {
          id: 4,
          city: 'Wyszkow'
      },
      {
          id: 5,
          city: 'Wasawa'
      },
      {
          id: 2,
          city: 'Musawa'
      },
      {
          id: 1,
          city: 'Desawa'
      },
      {
          id: 3,
          city: 'Lasawa'
      }
  ]), toBe(Array([
      {
          id: 1,
          city: 'Desawa'
      },
      {
          id: 2,
          city: 'Musawa'
      },
      {
          id: 3,
          city: 'Lasawa'
      },
      {
          id: 4,
          city: 'Wyszkow'
      },
      {
          id: 5,
          city: 'Wasawa'
      }
  ])));
});
