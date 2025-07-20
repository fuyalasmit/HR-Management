import json

print("Starting to update department data...")

# Read the current department data
with open('department.json', 'r') as f:
    departments = json.load(f)

print(f"Found {len(departments)} departments")
print("Current departments:")
for dept in departments:
    print(f"  ID: {dept['id']}, Name: {dept['departmentName']}")

# Update departments to only have Computer and Electronics
new_departments = [
    {
        "id": 1,
        "departmentName": "Computer",
        "departmentManagerId": None,
        "createdAt": "2024-09-18T21:06:39.645Z",
        "updatedAt": "2024-09-18T21:06:39.645Z"
    },
    {
        "id": 2,
        "departmentName": "Electronics",
        "departmentManagerId": None,
        "createdAt": "2024-09-18T21:06:39.645Z",
        "updatedAt": "2024-09-18T21:06:39.645Z"
    }
]

# Write the updated department data
with open('department.json', 'w') as f:
    json.dump(new_departments, f, indent=2)

print("Successfully updated departments to Computer and Electronics")
