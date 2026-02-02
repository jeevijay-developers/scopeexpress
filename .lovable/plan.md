
# Library Location Management Feature

## Overview
This plan adds a comprehensive library location management system with two main parts:
1. **Admin Panel**: Add/manage libraries with location details
2. **Public Website**: Location-based library discovery with city search/autocomplete

---

## Database Changes

### New Table: `libraries`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Library name (e.g., "Scope Express - Kota") |
| city | text | City name |
| state | text | State name |
| address | text | Full address |
| pin_code | text | Postal code |
| phone | text | Contact number |
| facilities | jsonb | Array of facilities (AC, WiFi, etc.) |
| timings | text | Opening hours |
| seats | integer | Total seats available |
| price_per_month | integer | Monthly membership price |
| is_active | boolean | Whether library is currently accepting members |
| created_at | timestamp | Creation timestamp |

### RLS Policies
- **Anyone can read**: Allow public SELECT on active libraries
- **Only admins can manage**: Admin-only INSERT/UPDATE/DELETE

### Update `leads` Table
- Add `library_id` column (uuid, nullable) to track which library location the user is interested in
- Add `city` column (text, nullable) for storing selected city

---

## Admin Panel Changes

### New Component: `LibraryLocationsManager`
**Features:**
- Display list of all library locations with search/filter
- Add new library with form including:
  - Library name
  - City (with autocomplete from Indian cities list)
  - State (auto-filled based on city)
  - Full address
  - Pin code
  - Phone number
  - Facilities (multi-select checkboxes)
  - Opening timings
  - Number of seats
  - Monthly price
  - Active/Inactive toggle
- Edit existing library details
- Delete library (with confirmation)
- Quick toggle for active/inactive status

### Admin Dashboard Updates
- Add "Library Locations" tab in the sidebar menu
- Update LibraryManager to show enquiries grouped by library location

---

## Public Library Page Changes

### City Selection Component
**User Flow:**
1. User lands on `/library` page
2. First sees a city search/selection interface
3. User types city name (e.g., "Kota", "Jabalpur", "Amarpatan")
4. Autocomplete suggests matching cities from comprehensive Indian cities list
5. User selects their preferred city
6. Page displays libraries available in that city

### City Autocomplete Data
Include major Indian cities across all states:
- **Madhya Pradesh**: Jabalpur, Bhopal, Indore, Gwalior, Amarpatan, Satna, Rewa, Sagar
- **Rajasthan**: Kota, Jaipur, Jodhpur, Udaipur, Ajmer, Bikaner
- **Uttar Pradesh**: Lucknow, Kanpur, Varanasi, Allahabad, Agra, Noida
- **Maharashtra**: Mumbai, Pune, Nagpur, Nashik, Aurangabad
- **Delhi NCR**: New Delhi, Gurgaon, Faridabad, Ghaziabad
- **Bihar**: Patna, Gaya, Muzaffarpur, Bhagalpur
- **And 500+ more cities across all states**

### Library Cards Display
After city selection, show:
- Library cards with name, address, facilities icons
- Pricing information
- Available seats
- "Join Now" button leading to enquiry form
- If no libraries in selected city: Show "Coming Soon" message with option to express interest

### Updated Enquiry Form
- Pre-fill selected city
- Pre-select library if only one in the city
- Add library location dropdown if multiple libraries in city
- Submit creates lead with library_id reference

---

## Technical Implementation

### Files to Create
1. `src/components/admin/LibraryLocationsManager.tsx` - Admin library management
2. `src/components/library/CitySearch.tsx` - City autocomplete component
3. `src/components/library/LibraryCard.tsx` - Display library info card
4. `src/data/indianCities.ts` - Comprehensive list of Indian cities

### Files to Modify
1. `src/pages/admin/AdminDashboard.tsx` - Add library locations tab
2. `src/pages/Library.tsx` - Add city selection and location-based display
3. `src/components/admin/LibraryManager.tsx` - Group enquiries by location

### Database Migration
- Create `libraries` table with RLS policies
- Add `library_id` and `city` columns to `leads` table

---

## User Experience Flow

```
User visits /library
        |
        v
+------------------+
|  Select Your     |
|  City            |
|  [Search box]    |
+------------------+
        |
        v (types "Kota")
+------------------+
|  Suggestions:    |
|  - Kota          |
|  - Kotdwar       |
|  - Kotputli      |
+------------------+
        |
        v (selects "Kota")
+------------------+     +------------------+
| Library Card 1   |     | Library Card 2   |
| Scope Express    |     | Scope Express    |
| Kota Main        |     | Kota South       |
| [Join Now]       |     | [Join Now]       |
+------------------+     +------------------+
        |
        v (clicks Join Now)
+------------------+
|  Enquiry Form    |
|  City: Kota      |
|  Location: [v]   |
|  Name: ____      |
|  Mobile: ____    |
+------------------+
```

---

## Key Features Summary

| Feature | Admin | User |
|---------|-------|------|
| Add library locations | Yes | - |
| Edit/delete locations | Yes | - |
| View all enquiries by location | Yes | - |
| Search city with autocomplete | - | Yes |
| View libraries in city | - | Yes |
| Submit enquiry for specific location | - | Yes |
| See "Coming Soon" for unavailable cities | - | Yes |
