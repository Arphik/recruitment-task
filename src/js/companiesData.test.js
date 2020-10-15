// import CompaniesData from './CompaniesData.js';

// jest.mock('./CompaniesData');

// beforeEach(() => {
//     // Clear all instances and calls to constructor and all methods:
//     CompaniesData.mockClear();
//   });

// it('Testing sorting objects by one property.',  () => {
//     const companiesData = new CompaniesData();
//     expect(companiesData.sortResults('id', true, [
//         {
//             id: 4,
//             city: 'Wyszkow'
//         },
//         {
//             id: 5,
//             city: 'Wasawa'
//         },
//         {
//             id: 2,
//             city: 'Musawa'
//         },
//         {
//             id: 1,
//             city: 'Desawa'
//         },
//         {
//             id: 3,
//             city: 'Lasawa'
//         }
//     ])).toBe(Array([
//         {
//             id: 1,
//             city: 'Desawa'
//         },
//         {
//             id: 2,
//             city: 'Musawa'
//         },
//         {
//             id: 3,
//             city: 'Lasawa'
//         },
//         {
//             id: 4,
//             city: 'Wyszkow'
//         },
//         {
//             id: 5,
//             city: 'Wasawa'
//         }
//     ]))
// });