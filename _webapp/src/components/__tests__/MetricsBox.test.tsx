import { render, screen } from '../../test-utils';
import MetricsBox from '../MetricsBox';

describe('MetricsBox', () => {
  const mockResult = {
    positioned: [
      { entityId: '1', type: 'TypeA', level: 0 },
      { entityId: '2', type: 'TypeB', level: 1 },
      { entityId: '3', type: 'TypeA', level: 1 },
      { entityId: '4', type: 'TypeC', level: 2 },
    ],
    groups: [
      { entities: [{ entityId: '1', type: 'TypeA', level: 0 }] },
      { entities: [{ entityId: '2', type: 'TypeB', level: 1 }] },
    ],
  };

  it('should render the component with title', () => {
    render(<MetricsBox result={null} />);
    expect(screen.getByText('Graph Metrics')).toBeInTheDocument();
  });

  it('should show loading state when isLoading is true', () => {
    render(<MetricsBox result={null} isLoading={true} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show empty state message when result is null', () => {
    render(<MetricsBox result={null} />);
    expect(screen.getByText('Generate a graph to see metrics')).toBeInTheDocument();
  });

  it('should display correct metrics when result is provided', () => {
    render(<MetricsBox result={mockResult} />);
    
    // Check title
    expect(screen.getByText('Graph Metrics')).toBeInTheDocument();
    
    // Check metric labels
    expect(screen.getByText('Total Entities')).toBeInTheDocument();
    expect(screen.getByText('Connected Groups')).toBeInTheDocument();
    expect(screen.getByText('Entity Types')).toBeInTheDocument();
    
    // Check metric values
    expect(screen.getByText('4')).toBeInTheDocument(); // Total entities
    expect(screen.getByText('2')).toBeInTheDocument(); // Connected groups
    expect(screen.getByText('3')).toBeInTheDocument(); // Entity types (TypeA, TypeB, TypeC)
  });

  it('should calculate unique entity types correctly', () => {
    const resultWithDuplicateTypes = {
      positioned: [
        { entityId: '1', type: 'TypeA', level: 0 },
        { entityId: '2', type: 'TypeA', level: 1 },
        { entityId: '3', type: 'TypeB', level: 1 },
        { entityId: '4', type: 'TypeB', level: 2 },
        { entityId: '5', type: 'TypeB', level: 2 },
      ],
      groups: [],
    };
    
    render(<MetricsBox result={resultWithDuplicateTypes} />);
    
    // Should show 2 unique types (TypeA and TypeB)
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should handle empty positioned array', () => {
    const emptyResult = {
      positioned: [],
      groups: [],
    };
    
    render(<MetricsBox result={emptyResult} />);
    
    // All metrics should be 0
    const zeroChips = screen.getAllByText('0');
    expect(zeroChips).toHaveLength(3); // Total entities, Connected groups, Entity types
  });

  it('should not break when result has no groups property', () => {
    const resultWithoutGroups = {
      positioned: [
        { entityId: '1', type: 'TypeA', level: 0 },
        { entityId: '2', type: 'TypeB', level: 1 },
      ],
    };
    
    render(<MetricsBox result={resultWithoutGroups} />);
    
    expect(screen.getByText('Total Entities')).toBeInTheDocument();
    expect(screen.getByText('Connected Groups')).toBeInTheDocument();
    expect(screen.getByText('Entity Types')).toBeInTheDocument();
    
    // Check specific metric values - Total entities should be 2
    const totalEntitiesChip = screen.getByText('Total Entities').parentElement?.querySelector('.MuiChip-root');
    expect(totalEntitiesChip).toHaveTextContent('2');
    
    // Connected groups should be 0 (no groups property)
    const connectedGroupsChip = screen.getByText('Connected Groups').parentElement?.querySelector('.MuiChip-root');
    expect(connectedGroupsChip).toHaveTextContent('0');
  });
});