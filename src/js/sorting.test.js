import {sortResults} from './sort';

  
test('Testing sorting objects by one property.',  () => {
    expect(sortResults('id', true, [
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
    ])).toBe(Array([
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
    ]))
});