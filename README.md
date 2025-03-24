# Photo Selection App

A web application for efficiently selecting photos from a large collection (approximately 2,000 images). The app allows you to compare photos side by side with zoom functionality and convenient navigation.

## Features

- **Photo Comparison**: View and compare 2 or 4 photos simultaneously
- **Zoom Controls**: 
  - Individual zoom controls for each photo
  - Global zoom control affecting all displayed photos
  - Pan with mouse drag
- **Selection Management**:
  - Select/deselect individual photos
  - Real-time counter of selected photos
  - Save selected photos to a separate directory
- **Navigation**:
  - Page-based navigation
  - Adjustable photos per page (2 or 4)
  - Quick navigation to first/previous/next/last pages

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd select-photo
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Image File Location:
   - Place your photos in the `public/images` directory
   - Supported image formats: jpg, jpeg, png, gif
   - Example path: `public/images/IMG_1234.jpg`

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Viewing Photos**:
   - Photos from the `public/images` directory are loaded automatically
   - Choose to display 2 or 4 photos per page using the dropdown

2. **Photo Controls**:
   - Use `-/Reset/+` buttons below each photo for individual zoom control
   - Use global zoom controls at the top to adjust all photos simultaneously
   - Drag to pan around zoomed photos

3. **Selecting Photos**:
   - Click the "Select" button on each photo to toggle selection
   - Selected photos are highlighted with a blue border
   - Total number of selected photos is displayed at the top

4. **Navigation**:
   - Use First/Previous/Next/Last buttons for page navigation
   - Click page numbers directly
   - Adjust the number of photos per page

5. **Saving Selections**:
   - Click "Save Selected Photos" to save your selection
   - Selected photos will be copied to `public/selected` directory
   - Original photos remain in their location
   - Example:
     ```
     public/
     ├── images/
     │   ├── IMG_1234.jpg
     │   ├── IMG_5678.jpg
     │   └── ...
     └── selected/
         ├── IMG_1234.jpg
         └── IMG_5678.jpg
     ```

## Technical Stack

- Next.js 13+ and TypeScript
- React Zoom Pan Pinch for image manipulation
- Tailwind CSS for styling
- Responsive design
- Optimized for large image collections

## License

This project is licensed under the MIT License - see the LICENSE file for details.
