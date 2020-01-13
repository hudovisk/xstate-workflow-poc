import Profile from "../domain/profile";

interface ProfileRepository {
  getById(id: string): Promise<Profile>;
  save(profile: Profile): Promise<Profile>;
}

export default ProfileRepository;
