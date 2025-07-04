import {
  generateEntityTypeColors,
  generateConnectorTypeStyles,
  getEntityTypeColor,
  getConnectorTypeStyle,
  ConnectorStyle
} from '../colorUtils';

describe('colorUtils', () => {
  describe('generateEntityTypeColors', () => {
    it('should return predefined colors for small numbers of types', () => {
      const colors2 = generateEntityTypeColors(2);
      expect(colors2).toHaveLength(2);
      expect(colors2[0]).toBe('#1976d2'); // Blue
      expect(colors2[1]).toBe('#d32f2f'); // Red

      const colors4 = generateEntityTypeColors(4);
      expect(colors4).toHaveLength(4);
      expect(colors4[3]).toBe('#f57c00'); // Orange
    });

    it('should generate HSL colors for more than 8 types', () => {
      const colors10 = generateEntityTypeColors(10);
      expect(colors10).toHaveLength(10);
      
      // Check that generated colors are in HSL format
      colors10.forEach(color => {
        expect(color).toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
      });
    });

    it('should handle zero types', () => {
      const colors = generateEntityTypeColors(0);
      expect(colors).toHaveLength(0);
    });
  });

  describe('generateConnectorTypeStyles', () => {
    it('should generate styles with correct properties', () => {
      const styles = generateConnectorTypeStyles(3);
      expect(styles).toHaveLength(3);
      
      styles.forEach((style: ConnectorStyle) => {
        expect(style).toHaveProperty('color');
        expect(style).toHaveProperty('strokeWidth');
        expect(style).toHaveProperty('opacity');
        expect(style.strokeWidth).toBe(2);
        expect(style.opacity).toBe(0.8);
        expect(style.strokeDasharray).toBeUndefined(); // Solid lines
      });
    });

    it('should cycle through base colors for large numbers', () => {
      const styles = generateConnectorTypeStyles(10);
      expect(styles).toHaveLength(10);
      
      // First and ninth styles should have the same color (cycling)
      expect(styles[0].color).toBe(styles[8].color);
    });
  });

  describe('getEntityTypeColor', () => {
    it('should return correct color for valid index', () => {
      const colors = ['#red', '#blue', '#green'];
      expect(getEntityTypeColor(0, colors)).toBe('#red');
      expect(getEntityTypeColor(1, colors)).toBe('#blue');
      expect(getEntityTypeColor(2, colors)).toBe('#green');
    });

    it('should cycle through colors for index beyond array length', () => {
      const colors = ['#red', '#blue'];
      expect(getEntityTypeColor(2, colors)).toBe('#red'); // cycles back
      expect(getEntityTypeColor(3, colors)).toBe('#blue');
    });
  });

  describe('getConnectorTypeStyle', () => {
    it('should return correct style for valid index', () => {
      const styles: ConnectorStyle[] = [
        { color: '#000', strokeWidth: 1, opacity: 0.5 },
        { color: '#fff', strokeWidth: 2, opacity: 1.0 }
      ];
      
      const style0 = getConnectorTypeStyle(0, styles);
      expect(style0.color).toBe('#000');
      expect(style0.strokeWidth).toBe(1);
      
      const style1 = getConnectorTypeStyle(1, styles);
      expect(style1.color).toBe('#fff');
      expect(style1.strokeWidth).toBe(2);
    });

    it('should cycle through styles for index beyond array length', () => {
      const styles: ConnectorStyle[] = [
        { color: '#000', strokeWidth: 1, opacity: 0.5 }
      ];
      
      const style0 = getConnectorTypeStyle(0, styles);
      const style1 = getConnectorTypeStyle(1, styles);
      expect(style0).toEqual(style1); // Should be the same
    });
  });
});