import { describe, expect, it } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import ButtonCard from './ButtonCard.vue';

function renderButtonCard(button) {
  return renderToString(
    createSSRApp({
      render: () => h(ButtonCard, { button }),
    }),
  );
}

describe('ButtonCard', () => {
  it('does not render the Home Assistant entity name on the home page card', async () => {
    const html = await renderButtonCard({
      id: 1,
      label: 'Salon',
      entityId: 'light.salon',
      icon: 'lightbulb',
      color: '#38bdf8',
      kind: 'light',
      state: 'on',
    });

    expect(html).toContain('Salon');
    expect(html).toContain('💡');
    expect(html).toContain('on');
    expect(html).not.toContain('light.salon');
  });
});
