
# Improve Join Library Form with Pre-filled City & Library Name

## Overview
Enhance the library join flow so that when a user clicks "Join Now" on a library card, the enquiry form shows the selected **city** and **library name** as read-only pre-filled fields. Also update the admin panel's Library Enquiries table to show the **city** and **library name** columns.

---

## User-Side Changes (Library.tsx)

### Enquiry Form Updates
- Add two read-only/display fields at the top of the form:
  - **City** -- pre-filled from the selected city (e.g., "Kota")
  - **Library Name** -- pre-filled from the selected library (e.g., "Scope Express - Kota Main")
- These fields should be clearly visible but not editable (since they come from the selection)
- If no library was selected (e.g., "Coming Soon" notify flow), show only the city

---

## Admin-Side Changes (LibraryManager.tsx)

### Lead Interface Update
- Add `city` and `library_id` fields to the Lead interface

### Enquiries Table Updates
- Add **City** column to the table showing `lead.city`
- Add **Library** column -- fetch library names from the `libraries` table to map `library_id` to a name
- This lets admins see exactly which city and branch each enquiry came from

---

## Technical Details

### Files to Modify

1. **`src/pages/Library.tsx`** (lines ~442-543)
   - Add city and library name display fields (styled as read-only badges/inputs) above the existing name/mobile fields in the enquiry form

2. **`src/components/admin/LibraryManager.tsx`**
   - Update `Lead` interface to include `city: string | null` and `library_id: string | null`
   - Fetch libraries list from database to resolve `library_id` to library name
   - Add "City" and "Library" columns to the enquiries table

### No database changes needed
The `leads` table already has `city` and `library_id` columns, and the form already submits these values. This is purely a UI improvement.
