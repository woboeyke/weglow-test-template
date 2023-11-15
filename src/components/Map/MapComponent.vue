<template>
  <div class="q-mx-md q-mt-md full-width" id="map"></div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineComponent, ref } from 'vue';
import { Map, MapboxOptions } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
import { useMapStore } from 'src/stores/MapStore';
import { useWebsiteContentStore } from 'src/stores/WebsiteContentStore';

export default defineComponent({
  name: 'MapContainerComponent',
  setup() {
    const contentStore = useWebsiteContentStore();

    return {
      contentStore: ref(contentStore),
    };
  },
  data() {
    return {
      map: null as unknown as Map,
      markers: [] as any[],
    };
  },
  methods: {
    updateMap() {
      const mapStore = useMapStore();

      const candlesGeojson = {
        type: 'FeatureCollection',
        features: mapStore.candleLocations.map((location) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [location[1], location[0]],
          },
          properties: {},
        })),
      };

      if (this.map.getLayer('points')) {
        this.map.removeLayer('points');
      }
      if (this.map.getSource('candles')) {
        this.map.removeSource('candles');
      }

      this.map.addSource('candles', {
        type: 'geojson',
        data: candlesGeojson as any,
        cluster: true,
        clusterRadius: 80,
      });

      this.map.addLayer({
        id: 'points',
        type: 'symbol',
        source: 'candles',
        layout: {
          'text-field': ['get', 'title'],
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 1.25],
          'text-anchor': 'top',
        },
      });

      this.map.on('sourcedata', () => this.updateMarkers());
    },
    updateMarkers() {
      const features = this.map.querySourceFeatures('candles', {
        sourceLayer: 'symbol',
      });

      const newMarkers = [] as any[];

      features.forEach((feature) => {
        const coords = (feature.geometry as any).coordinates;
        const props = feature.properties;

        if (!props) {
          return;
        }

        const el = document.createElement('div');
        el.className = 'marker';
        const sanitizedURL = this.contentStore.content.candleImageURL.replace(/\(/g, '\\(').replace(/\)/g, '\\)');
        el.style.backgroundImage = `url(${sanitizedURL})`;
        el.style.width = `${32}px`;
        el.style.height = `${32}px`;
        el.style.backgroundPosition = 'center';
        el.style.backgroundRepeat = 'no-repeat';

        if (props.cluster) {
          el.innerHTML = `<span class="marker_icon">${props.point_count}</span>`;
        }

        const marker = new mapboxgl.Marker(el).setLngLat(coords).addTo(this.map);
        newMarkers.push(marker);
      });

      // Remove old markers
      this.markers.forEach((marker) => marker.remove());

      // Update markers array
      this.markers = newMarkers;
    },
    newMapData() {
      const mapStore = useMapStore();
      const candlesGeojson = {
        type: 'FeatureCollection',
        features: mapStore.candles.map((candle) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [candle.lng, candle.lat],
          },
          properties: {},
        })),
      };

      if (this.map.getLayer('points')) {
        this.map.removeLayer('points');
      }
      if (this.map.getSource('candles')) {
        this.map.removeSource('candles');
      }

      this.map.addSource('candles', {
        type: 'geojson',
        data: candlesGeojson as any,
        cluster: true,
        clusterRadius: 80,
      });

      this.map.addLayer({
        id: 'points',
        type: 'symbol',
        source: 'candles',
        layout: {
          'text-field': ['get', 'title'],
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 1.25],
          'text-anchor': 'top',
        },
      });

      this.updateMarkers();
    },
  },
  mounted() {
    mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN as string;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: process.env.MAPBOX_MAP_STYLE,
      center: [4, 50.5],
      zoom: 7,
    } as MapboxOptions);

    this.map.on('load', () => {
      this.updateMap();
      this.map.on('moveend', () => {
        this.updateMarkers();
      });
    });
    this.map.on('wheel', (event: any) => {
      if (event.originalEvent.ctrlKey) {
        return;
      }

      if (event.originalEvent.metaKey) {
        return;
      }

      if (event.originalEvent.altKey) {
        return;
      }

      event.preventDefault();
    });
    this.map.addControl(new mapboxgl.NavigationControl());
  },
  computed: {
    candles() {
      return useMapStore().candles;
    },
  },
  watch: {
    candles() {
      this.newMapData();
    },
  },
});
</script>

<style lang="scss" scoped>
#map {
  height: 50vh;
  max-height: 50vh;
}
</style>

<style lang="scss">
.marker {
  background-size: cover;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
}
.marker_icon {
  position: absolute;
  z-index: 3;
  right: -8px;
  top: -15px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: #ffffff 1px;
  color: #ffffff;
  background-color: var(--q-accent);
  text-align: center;
  font-size: 12px;
}
</style>
