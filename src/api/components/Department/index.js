const db = require('../../db/models/departments/department_db');

const Department = async (selectedDepartments) => {
  const departments = await db.findAll();

  if (!selectedDepartments) {
    selectedDepartments = [];
  }

  return departments
    .map((department) => {
      return `
        <div class="form-check d-flex align-items-center gap-2 mx-3 col-4">
            <input
                class="form-check-input"
                type="checkbox"
                value="${department.name}"
                id="${department._id}"
                name="departments"
                ${
                  selectedDepartments.includes(department.name) ? 'checked' : ''
                }
            />
            <label class="form-check-label" for="${department._id}">
                ${department.name}
            </label>
        </div>
        `;
    })
    .join('');
};

module.exports = Department;
