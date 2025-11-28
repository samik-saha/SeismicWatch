# SeismicWatch

SeismicWatch is a modern, interactive web application for visualizing global earthquake data. It provides real-time updates from the USGS API, allowing users to track seismic activity around the world through both 2D map and 3D globe visualizations.

[**View Live Demo**](https://samik-saha.github.io/SeismicWatch/)

## Features

-   **Real-time Data**: Fetches the latest earthquake data from the USGS.
-   **Interactive Visualizations**:
    -   **Map View**: A detailed 2D map projection.
    -   **Globe View**: An immersive 3D interactive globe.
-   **Detailed Insights**: Click on any earthquake to see detailed information, including magnitude, depth, and location.
-   **Filtering**: Filter earthquakes by time range (Past Hour, Past Day, Past 7 Days, Past 30 Days).
-   **Responsive Design**: Optimized for both desktop and mobile devices.

## Getting Started

### Prerequisites

-   Node.js (v18.17.0 or higher)
-   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/samik-saha/SeismicWatch.git
    cd SeismicWatch
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the App

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the URL shown in your terminal).

### Building for Production

To build the application for production:

```bash
npm run build
```

The built artifacts will be in the `dist` directory.
