const assert = require('node:assert/strict');

// Exercise the compiled adapter, not its source or the presence of a type declaration.
module.exports = async function assertTelemetry(ContentDelivery, PrezlyAdapter) {
    const collector = ContentDelivery.createMetricsCollector({ runtime: 'node' });
    let originRequests = 0;
    const adapter = PrezlyAdapter.connect(
        { accessToken: 'fixture-token', newsroom: 'fixture-newsroom' },
        {
            telemetry: collector.observe,
            fetch: async () => {
                originRequests += 1;
                return Response.json({ newsroom: { uuid: 'fixture-newsroom', name: 'Fixture' } });
            },
        },
    );
    const { contentDelivery } = adapter.usePrezlyClient();
    const result = await contentDelivery.newsroom();
    assert.equal(result.uuid, 'fixture-newsroom');
    assert.equal(originRequests, 1);
    const metrics = collector.render();
    assert.match(metrics, /theme_kit_content_requests_total\{[^\n]*operation="newsroom"[^\n]*\} 1/);
    assert.match(metrics, /theme_kit_upstream_requests_total\{[^\n]*route="newsroom"[^\n]*\} 1/);
};
