import { ContentDelivery } from '../build';
import { PrezlyAdapter } from '../build/server';

const collector = ContentDelivery.getMetricsCollector('node');
PrezlyAdapter.connect(
    { accessToken: 'fixture-token', newsroom: 'fixture-newsroom' },
    { telemetry: collector.observe },
);
