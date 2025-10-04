export interface BlogPost {
  slug: string;
  imageSrc: string;
  category: string;
  title: string;
  excerpt: string;
  fullContent: string;
}

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const blogPosts: BlogPost[] = [
  {
    slug: generateSlug('The Critical Role of Bats in Pest Control'),
    imageSrc: 'https://images.pexels.com/photos/38008/pexels-photo-38008.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Conservation',
    title: 'The Critical Role of Bats in Pest Control',
    excerpt: 'Did you know a single bat can eat thousands of insects in one night? Discover how bats are a farmer\'s best friend and vital for our ecosystems.',
    fullContent: `
A single bat can consume up to 1,200 mosquito-sized insects every hour. Across the United States alone, the value of bats' pest-control services is estimated to be worth more than **$3.7 billion a year**.

### A Natural Ally for Agriculture

Bats are a crucial component of healthy ecosystems and a significant contributor to sustainable agriculture. By preying on nocturnal insects, they reduce the crop damage caused by pests like moths, beetles, and leafhoppers that plague valuable crops such as corn, cotton, and pecans.

This natural form of pest control offers several key benefits:
- **Reduced Need for Pesticides:** With bats on patrol, farmers can decrease their reliance on chemical pesticides. This not only saves them money but also reduces the runoff of harmful chemicals into our soil and water systems, protecting other wildlife and human health.
- **Increased Crop Yields:** By keeping pest populations in check, bats help ensure healthier crops and greater yields, contributing directly to our food security.
- **Economic Savings:** The financial impact is immense. Protecting bat populations is a direct investment in the economic stability of our agricultural sector.

### How You Can Help

Protecting bat habitats is not just about saving a species; it's about preserving a natural, effective, and free pest control service that supports our food supply. Simple actions can make a huge difference:
- Install a bat house in your backyard to provide a safe roost.
- Avoid using harmful pesticides that can poison bats and their insect prey.
- Educate others about the incredible benefits bats provide.

By supporting bat conservation, we are supporting the health of our planet and the resilience of our food systems.
    `,
  },
  {
    slug: generateSlug('Impact of Wind Turbines on Bat Populations'),
    imageSrc: 'https://i.ibb.co/Gb5bsH5/wind-turbine-bat.png',
    category: 'Research',
    title: 'Impact of Wind Turbines on Bat Populations',
    excerpt: 'Exploring the challenges and solutions for mitigating the impact of renewable energy infrastructure on local bat populations.',
    fullContent: `
Wind energy is a cornerstone of our transition to a cleaner future, but it presents a significant challenge for wildlife, particularly bats. The push for renewable energy must be balanced with robust conservation strategies to protect vulnerable species.

### The Two-Fold Threat

Bat mortality at wind farms is primarily caused by two factors:
1.  **Direct Collision:** Bats can collide with the fast-moving blades of the turbines, especially during migration periods.
2.  **Barotrauma:** This is a less obvious but equally deadly threat. The rapid change in air pressure around the turbine blades can cause fatal internal injuries to bats' delicate lungs.

Migratory, tree-roosting species like the Hoary Bat and the Eastern Red Bat are often the most affected, as their migration routes can overlap with the locations of large wind farms.

### Innovative Mitigation Strategies

The goal is not to choose between clean energy and wildlife conservation, but to innovate and find solutions that allow them to coexist. Researchers and engineers are actively developing and refining several mitigation strategies:

- **Operational Curtailment:** This involves stopping or slowing turbine blades during periods of low wind speed when bats are most active (typically at night during late summer and fall). Studies have shown this can reduce bat fatalities by over 50% with minimal loss of energy production.
- **Acoustic Deterrents:** These devices are mounted on the turbines and emit high-frequency sounds that are disruptive to bats' echolocation. This creates an "uncomfortable" zone that encourages bats to stay away from the dangerous rotor-swept area.
- **Strategic Siting:** Careful planning and assessment before construction can ensure wind farms are built away from major bat migration corridors, critical foraging habitats, and large roosting sites.

Ongoing research at Dark Echology and other institutions is focused on making these solutions more effective and cost-efficient, paving the way for a future where green energy and thriving ecosystems go hand in hand.
    `,
  },
  {
    slug: generateSlug('Debunking Common Bat Myths'),
    imageSrc: 'https://images.pexels.com/photos/207999/pexels-photo-207999.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    category: 'Education',
    title: 'Debunking Common Bat Myths',
    excerpt: 'Vampires, rabies, and blindness. Let\'s separate fact from fiction and uncover the truth about these fascinating and misunderstood creatures.',
    fullContent: `
Bats are among the most misunderstood animals on the planet, shrouded in folklore and misinformation. It's time to shine a light on the truth and replace fear with fascination.

### Myth 1: All bats are vampires.
**Fact:** Out of over 1,400 species of bats worldwide, only three are vampire bats, and they all live in Latin America. They do not attack humans; their primary food source is blood from sleeping cattle and birds, which they typically take in amounts so small the animal often doesn't even wake up.

### Myth 2: Bats are flying rodents.
**Fact:** Bats are not rodents. They belong to their own unique scientific order, **Chiroptera**. Genetically, they are more closely related to primates (including humans) and lemurs than they are to mice or rats.

### Myth 3: Bats are blind.
**Fact:** The phrase "blind as a bat" is completely false. All bat species can see. However, for navigating and hunting in complete darkness, many species have evolved a remarkable sixth sense called **echolocation**. They emit high-frequency sounds and interpret the returning echoes to build a detailed "sound map" of their surroundings. It's a superpower, not a disability.

### Myth 4: All bats have rabies.
**Fact:** Like all mammals, bats can contract rabies, but the incidence is extremely low. Scientific studies show that less than half of one percent of the bat population is rabid. A bat with rabies typically becomes sick and dies quickly, and they rarely become aggressive. That being said, you should never handle any wild animal. If you see a bat on the ground or in need of help, contact a local wildlife professional.

By learning the facts, we can appreciate bats for what they truly are: ecologically vital, incredibly diverse, and fascinating creatures of the night.
    `,
  },
];
