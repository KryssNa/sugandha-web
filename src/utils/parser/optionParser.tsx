// utils/optionsParser.ts
export const parseOptionsFromResponse = (content: string): string[] => {
    try {
      // Extract options section
      const nextChoicesSection = content.split('NEXT_CHOICES:')[1];
      
      if (!nextChoicesSection) return [];
  
      // Parse individual options
      return nextChoicesSection
        .split('\n')
        .filter(line => line.trim().startsWith('•'))
        .map(line => {
          // Extract option name without description
          const option = line.trim().substring(2);
          const mainOption = option.split(':')[0].trim();
          return mainOption;
        })
        .filter(Boolean);
    } catch (error) {
      console.error('Error parsing options:', error);
      return [];
    }
  };
  
  export const getMainContent = (content: string): string => {
    // Return content before NEXT_CHOICES section
    const mainContent = content.split('NEXT_CHOICES:')[0].trim();
    return mainContent;
  };