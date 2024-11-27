const db = require('../../db/models/profiles/profile_db');

const Profile = async (profiles = []) => {
  const candidateProfiles = await db.findAll();

  return candidateProfiles
    .map((profile) => {
      return `
        <div class="form-check d-flex align-items-center gap-1 mx-1 col-5">
            <input
                class="form-check-input"
                type="checkbox"
                value="${profile._id}"
                id="${profile._id}"
                name="profile"
                ${profiles.includes(profile._id.toString()) ? 'checked' : ''}
            />
            <label class="form-check-label" for="${profile._id}">
                ${profile.name}
            </label>
        </div>
        `;
    })
    .join('');
};

module.exports = Profile;
