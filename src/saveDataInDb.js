import Pet from './models/Pet';
import User from './models/User';

export default async function saveDataInDb(data) {
  // try {

    await User.remove({});
    await Pet.remove({});

    const userPromises = data.users.map((user) => {
      return (new User(user)).save();
    });

    const petPromises = data.pets.map((pet) => {
      return (new Pet(pet)).save();
    });
    
    console.log('success');
    return {
      users: await Promise.all(userPromises),
      pets: await Promise.all(petPromises),
    };
    
  // } catch(e) {
  //   console.log(e);
  //   throw e;
  // }
}