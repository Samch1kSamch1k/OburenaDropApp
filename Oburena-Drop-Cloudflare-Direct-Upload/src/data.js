const makeDrop = (name, type, rarity, chance) => ({ name, type, rarity, chance });

const cases = [
  {
    id: 'ember-cache', name: 'Ember Cache', category: 'budget', price: 0.20, tag: 'FIRST HIT', image: '/cases/ember-cache.svg', accent: 'ember',
    drops: [makeDrop('Glock-18 | Cinderline', 'weapon', 'Mil-Spec', 44), makeDrop('P250 | Heat Check', 'weapon', 'Restricted', 31), makeDrop('MP9 | Brass Spark', 'weapon', 'Classified', 20), makeDrop('Sticker | Red Eye', 'sticker', 'Covert', 5)]
  },
  {
    id: 'rustline', name: 'Rustline Stash', category: 'budget', price: 0.35, tag: 'POCKET CHANGE', image: '/cases/rustline.svg', accent: 'rust',
    drops: [makeDrop('MP7 | Copper Wire', 'weapon', 'Mil-Spec', 44), makeDrop('UMP-45 | Dry Dock', 'weapon', 'Restricted', 31), makeDrop('Tec-9 | Rust Bloom', 'weapon', 'Classified', 20), makeDrop('Charm | Rivet Ripper', 'charm', 'Covert', 5)]
  },
  {
    id: 'redroom', name: 'Red Room', category: 'budget', price: 0.50, tag: 'EYES ON', image: '/cases/redroom.svg', accent: 'red',
    drops: [makeDrop('MAC-10 | Curtain Call', 'weapon', 'Mil-Spec', 44), makeDrop('Five-SeveN | Spotlight', 'weapon', 'Restricted', 31), makeDrop('FAMAS | Redacted', 'weapon', 'Classified', 20), makeDrop('Sticker | House Lights', 'sticker', 'Covert', 5)]
  },
  {
    id: 'smoke-break', name: 'Smoke Break', category: 'budget', price: 0.69, tag: 'SMOKE TEST', image: '/cases/smoke-break.svg', accent: 'smoke',
    drops: [makeDrop('Nova | Ash Cloud', 'weapon', 'Mil-Spec', 44), makeDrop('XM1014 | Grey Matter', 'weapon', 'Restricted', 31), makeDrop('SG 553 | Fadeout', 'weapon', 'Classified', 20), makeDrop('Graffiti | Fog Bank', 'graffiti', 'Covert', 5)]
  },
  {
    id: 'nightshift', name: 'Night Shift', category: 'budget', price: 0.85, tag: 'AFTER HOURS', image: '/cases/nightshift.svg', accent: 'night',
    drops: [makeDrop('MP5-SD | Graveyard', 'weapon', 'Mil-Spec', 44), makeDrop('P90 | Night Porter', 'weapon', 'Restricted', 31), makeDrop('AUG | Last Train', 'weapon', 'Classified', 20), makeDrop('Sticker | 03:17', 'sticker', 'Covert', 5)]
  },
  {
    id: 'metro-flash', name: 'Metro Flash', category: 'budget', price: 1.20, tag: 'UNDERGROUND', image: '/cases/metro-flash.svg', accent: 'metro',
    drops: [makeDrop('USP-S | Platform 9', 'weapon', 'Mil-Spec', 44), makeDrop('P2000 | Signal Lost', 'weapon', 'Restricted', 31), makeDrop('Galil AR | Turnstile', 'weapon', 'Classified', 20), makeDrop('Sticker | No Exit', 'sticker', 'Covert', 5)]
  },
  {
    id: 'corner-store', name: 'Corner Store', category: 'budget', price: 1.75, tag: 'SIDE STREET', image: '/cases/corner-store.svg', accent: 'olive',
    drops: [makeDrop('G3SG1 | Green Receipt', 'weapon', 'Mil-Spec', 44), makeDrop('PP-Bizon | Night Grocer', 'weapon', 'Restricted', 31), makeDrop('Dual Berettas | Loose Change', 'weapon', 'Classified', 20), makeDrop('Graffiti | Open Late', 'graffiti', 'Covert', 5)]
  },
  {
    id: 'overtime', name: 'Overtime', category: 'budget', price: 2.50, tag: 'EXTRA ROUND', image: '/cases/overtime.svg', accent: 'amber',
    drops: [makeDrop('M4A4 | Clockwork', 'weapon', 'Mil-Spec', 44), makeDrop('CZ75-Auto | Sudden Death', 'weapon', 'Restricted', 31), makeDrop('MAG-7 | Long Weekend', 'weapon', 'Classified', 20), makeDrop('Sticker | Final Whistle', 'sticker', 'Covert', 5)]
  },
  {
    id: 'warmup-queue', name: 'Warmup Queue', category: 'budget', price: 3.50, tag: 'NEXT MATCH', image: '/cases/warmup-queue.svg', accent: 'violet',
    drops: [makeDrop('AK-47 | Practice Run', 'weapon', 'Mil-Spec', 44), makeDrop('M4A1-S | Queue Pop', 'weapon', 'Restricted', 31), makeDrop('SSG 08 | First Blood', 'weapon', 'Classified', 20), makeDrop('Sticker | Ready Up', 'sticker', 'Covert', 5)]
  },
  {
    id: 'rifle-rack', name: 'Rifle Rack', category: 'weapon', price: 5.00, tag: 'RIFLE SPECIAL', image: '/cases/rifle-rack.svg', accent: 'steel',
    drops: [makeDrop('AK-47 | Cold Bore', 'weapon', 'Mil-Spec', 44), makeDrop('M4A4 | Gunmetal Grid', 'weapon', 'Restricted', 31), makeDrop('FAMAS | Crosshair', 'weapon', 'Classified', 20), makeDrop('Galil AR | Steel Fang', 'weapon', 'Covert', 5)]
  },
  {
    id: 'recoil-lab', name: 'Recoil Lab', category: 'weapon', price: 9.50, tag: 'PRECISION KIT', image: '/cases/recoil-lab.svg', accent: 'blue',
    drops: [makeDrop('AUG | Calibration', 'weapon', 'Mil-Spec', 44), makeDrop('SG 553 | Zero Drift', 'weapon', 'Restricted', 31), makeDrop('AK-47 | Kickback', 'weapon', 'Classified', 20), makeDrop('M4A1-S | Tight Group', 'weapon', 'Covert', 5)]
  },
  {
    id: 'viper-case', name: 'Viper Case', category: 'weapon', price: 18.00, tag: 'SNAKEBITE', image: '/cases/viper-case.svg', accent: 'green',
    drops: [makeDrop('M4A1-S | Venom Wake', 'weapon', 'Mil-Spec', 44), makeDrop('P250 | Fangs Out', 'weapon', 'Restricted', 31), makeDrop('AWP | Snake Eyes', 'weapon', 'Classified', 20), makeDrop('Butterfly Knife | Coil', 'knife', 'Covert', 5)]
  },
  {
    id: 'dragon-lore', name: 'Dragon Lore', category: 'weapon', price: 32.00, tag: 'MYTHIC METAL', image: '/cases/dragon-lore.svg', accent: 'gold',
    drops: [makeDrop('AWP | Ember Drake', 'weapon', 'Mil-Spec', 44), makeDrop('AK-47 | Scaled Fury', 'weapon', 'Restricted', 31), makeDrop('M4A4 | Gilded Breath', 'weapon', 'Classified', 20), makeDrop('Karambit | Dragon Glass', 'knife', 'Covert', 5)]
  },
  {
    id: 'neon-strike', name: 'Neon Strike', category: 'weapon', price: 59.00, tag: 'CYBER ARMORY', image: '/cases/neon-strike.svg', accent: 'cyan',
    drops: [makeDrop('AK-47 | Afterimage', 'weapon', 'Mil-Spec', 44), makeDrop('USP-S | Neon Veil', 'weapon', 'Restricted', 31), makeDrop('M4A1-S | Laser Mesh', 'weapon', 'Classified', 20), makeDrop('Talon Knife | Pixel Burn', 'knife', 'Covert', 5)]
  },
  {
    id: 'aether-arsenal', name: 'Aether Arsenal', category: 'weapon', price: 99.00, tag: 'PRISM SERIES', image: '/cases/aether-arsenal.svg', accent: 'ice',
    drops: [makeDrop('AWP | Blue Shift', 'weapon', 'Mil-Spec', 44), makeDrop('M4A4 | Shardline', 'weapon', 'Restricted', 31), makeDrop('AK-47 | Cloud Chamber', 'weapon', 'Classified', 20), makeDrop('M9 Bayonet | Aether Edge', 'knife', 'Covert', 5)]
  },
  {
    id: 'clutch-crown', name: 'Clutch Crown', category: 'weapon', price: 175.00, tag: 'CROWN JEWEL', image: '/cases/clutch-crown.svg', accent: 'gold',
    drops: [makeDrop("Glock-18 | King's Gambit", 'weapon', 'Mil-Spec', 44), makeDrop('AWP | Overtime Crown', 'weapon', 'Restricted', 31), makeDrop('M4A4 | Last Stand', 'weapon', 'Classified', 20), makeDrop('Sport Gloves | Royal Clutch', 'gloves', 'Covert', 5)]
  },
  {
    id: 'crimson-elite', name: 'Crimson Elite', category: 'weapon', price: 299.00, tag: 'REDLINE CLASS', image: '/cases/crimson-elite.svg', accent: 'crimson',
    drops: [makeDrop('AK-47 | Ruby Directive', 'weapon', 'Mil-Spec', 44), makeDrop('M4A1-S | Blood Signal', 'weapon', 'Restricted', 31), makeDrop('AWP | Crimson Protocol', 'weapon', 'Classified', 20), makeDrop('Bayonet | Laser Cut', 'knife', 'Covert', 5)]
  },
  {
    id: 'oburena-prime', name: 'Oburena Prime', category: 'weapon', price: 499.00, tag: 'SIGNATURE DROP', image: '/cases/oburena-prime.svg', accent: 'prime',
    drops: [makeDrop('AK-47 | Oburena Protocol', 'weapon', 'Mil-Spec', 44), makeDrop('M4A4 | The Stare', 'weapon', 'Restricted', 31), makeDrop('AWP | Twin Beams', 'weapon', 'Classified', 20), makeDrop('Karambit | Oburena Edge', 'knife', 'Covert', 5)]
  },
  {
    id: 'sticker-bomb', name: 'Sticker Bomb', category: 'misc', price: 12.00, tag: 'SLAP IT ON', image: '/cases/sticker-bomb.svg', accent: 'sticker',
    drops: [makeDrop('Sticker | Side-Eye', 'sticker', 'Mil-Spec', 44), makeDrop('Sticker | Scope Bloom', 'sticker', 'Restricted', 31), makeDrop('Sticker | Redline Wink', 'sticker', 'Classified', 20), makeDrop('Sticker | Blazing Oburena', 'sticker', 'Covert', 5)]
  },
  {
    id: 'graffiti-goblin', name: 'Graffiti Goblin', category: 'misc', price: 45.00, tag: 'WALL CONTROL', image: '/cases/graffiti-goblin.svg', accent: 'paint',
    drops: [makeDrop('Graffiti | Sneaky Eye', 'graffiti', 'Mil-Spec', 44), makeDrop('Graffiti | Magenta Mist', 'graffiti', 'Restricted', 31), makeDrop('Graffiti | Goblin Grin', 'graffiti', 'Classified', 20), makeDrop('Graffiti | Red Warning', 'graffiti', 'Covert', 5)]
  },
  {
    id: 'map-memory', name: 'Map Memory', category: 'misc', price: 120.00, tag: 'OLD ROUTES', image: '/cases/map-memory.svg', accent: 'map',
    drops: [makeDrop('Souvenir Package | Dust II', 'souvenir', 'Mil-Spec', 44), makeDrop('Souvenir Package | Mirage', 'souvenir', 'Restricted', 31), makeDrop('Souvenir Package | Inferno', 'souvenir', 'Classified', 20), makeDrop('Souvenir Package | Nuke', 'souvenir', 'Covert', 5)]
  },
  {
    id: 'souvenir-glitch', name: 'Souvenir Glitch', category: 'misc', price: 280.00, tag: 'EVENT FINDS', image: '/cases/souvenir-glitch.svg', accent: 'holo',
    drops: [makeDrop('Sticker Capsule | Final Map', 'sticker', 'Mil-Spec', 44), makeDrop('Souvenir Token | Overtime', 'souvenir', 'Restricted', 31), makeDrop('Holo Sticker | Crowd Roar', 'sticker', 'Classified', 20), makeDrop('Souvenir AWP | Trophy Light', 'weapon', 'Covert', 5)]
  },
  {
    id: 'glove-vault', name: 'Glove Vault', category: 'misc', price: 650.00, tag: 'HAND CHECK', image: '/cases/glove-vault.svg', accent: 'gloves',
    drops: [makeDrop('Hand Wraps | Ash Grip', 'gloves', 'Mil-Spec', 44), makeDrop('Driver Gloves | Ember Stitch', 'gloves', 'Restricted', 31), makeDrop('Moto Gloves | Redline', 'gloves', 'Classified', 20), makeDrop('Specialist Gloves | Laser Grid', 'gloves', 'Covert', 5)]
  },
  {
    id: 'agent-archive', name: 'Agent Archive', category: 'misc', price: 999.00, tag: 'PERSONNEL FILES', image: '/cases/agent-archive.svg', accent: 'archive',
    drops: [makeDrop('Agent Patch | Watchful Eye', 'sticker', 'Mil-Spec', 44), makeDrop('Agent | Night Courier', 'agent', 'Restricted', 31), makeDrop('Agent | Crimson Sentinel', 'agent', 'Classified', 20), makeDrop('Agent | Oburena Operative', 'agent', 'Covert', 5)]
  },
  {
    id: 'charm-offensive', name: 'Charm Offensive', category: 'misc', price: 1499.00, tag: 'TINY TROPHIES', image: '/cases/charm-offensive.svg', accent: 'charm',
    drops: [makeDrop('Charm | Tiny Flash', 'charm', 'Mil-Spec', 44), makeDrop('Charm | Pocket Pistol', 'charm', 'Restricted', 31), makeDrop('Charm | Red Eye Relic', 'charm', 'Classified', 20), makeDrop('Charm | Golden Goblin', 'charm', 'Covert', 5)]
  },
  {
    id: 'heirloom-drop', name: 'Heirloom Drop', category: 'misc', price: 2999.00, tag: 'FROM THE VAULT', image: '/cases/heirloom-drop.svg', accent: 'heirloom',
    drops: [makeDrop('M9 Bayonet | Ancestral Flame', 'knife', 'Mil-Spec', 44), makeDrop('Classic Knife | Old Guard', 'knife', 'Restricted', 31), makeDrop('Butterfly Knife | Cinder Relic', 'knife', 'Classified', 20), makeDrop('Karambit | Bloodline Heirloom', 'knife', 'Covert', 5)]
  },
  {
    id: 'ultimate-oburena', name: 'Ultimate Oburena', category: 'misc', price: 4999.00, tag: 'FINAL GLARE', image: '/cases/ultimate-oburena.svg', accent: 'ultimate',
    drops: [makeDrop('AK-47 | Eye of the Storm', 'weapon', 'Mil-Spec', 44), makeDrop('Sport Gloves | Oburena Red', 'gloves', 'Restricted', 31), makeDrop('Butterfly Knife | Twin Laser', 'knife', 'Classified', 20), makeDrop('Golden Knife | The Final Stare', 'knife', 'Covert', 5)]
  }
];

const variationBlueprints = {
  budget: [
    ['M4A4', 'Close Call', 'weapon', 'Restricted'],
    ['Desert Eagle', 'Pocket Heat', 'weapon', 'Classified'],
    ['MP5-SD', 'Afterburn', 'weapon', 'Classified'],
    ['Galil AR', 'Crossfire', 'weapon', 'Classified'],
    ['AWP', 'Scarline', 'weapon', 'Covert'],
    ['Knife', 'Pocket Relic', 'knife', 'Covert'],
    ['Sticker', 'Laser Look', 'sticker', 'Mil-Spec'],
    ['Graffiti', 'Red Beacon', 'graffiti', 'Restricted']
  ],
  weapon: [
    ['AK-47', 'Clean Sight', 'weapon', 'Restricted'],
    ['M4A1-S', 'Pinpoint', 'weapon', 'Classified'],
    ['AWP', 'Red Reticle', 'weapon', 'Classified'],
    ['M4A4', 'Burst Signal', 'weapon', 'Classified'],
    ['Bayonet', 'Laser Edge', 'knife', 'Covert'],
    ['Sport Gloves', 'Recoil Grip', 'gloves', 'Covert'],
    ['Glock-18', 'Prime Count', 'weapon', 'Mil-Spec'],
    ['Galil AR', 'Sidewinder', 'weapon', 'Restricted']
  ],
  misc: [
    ['Souvenir Package', 'Finals Edition', 'souvenir', 'Restricted'],
    ['Sticker Capsule', 'Holo Flicker', 'sticker', 'Classified'],
    ['Agent', 'Redacted File', 'agent', 'Classified'],
    ['Graffiti', 'Artery Tag', 'graffiti', 'Classified'],
    ['Specialist Gloves', 'Vault Red', 'gloves', 'Covert'],
    ['Karambit', 'Archive Edge', 'knife', 'Covert'],
    ['Charm', 'One-Eyed', 'charm', 'Mil-Spec'],
    ['FAMAS', 'Runner Call', 'weapon', 'Restricted']
  ]
};

const extraDropBlueprints = {
  budget: [['AK-47', 'Cinder Rampart'], ['M4A1-S', 'Ashen Circuit'], ['Desert Eagle', 'Molten Eye'], ['P90', 'Redline Rush'], ['FAMAS', 'Coal Runner'], ['MP9', 'Flarepoint'], ['USP-S', 'Night Signal'], ['SSG 08', 'Rustscope'], ['MAC-10', 'Heatwave'], ['Nova', 'Smoke Trail'], ['Glock-18', 'Ember Check'], ['AWP', 'Afterglow']],
  weapon: [['AK-47', 'Obsidian Vector'], ['M4A1-S', 'Crimson Recoil'], ['AWP', 'Glass Horizon'], ['M4A4', 'Vandal Protocol'], ['Desert Eagle', 'Chrome Bite'], ['USP-S', 'Silent Voltage'], ['Glock-18', 'Red Shift'], ['FAMAS', 'Prism Break'], ['P90', 'Overdrive'], ['SSG 08', 'Long Watch'], ['MP9', 'Neon Circuit'], ['M9 Bayonet', 'Redline Edge']],
  misc: [['AK-47', 'Archive Fire'], ['AWP', 'Lost Signal'], ['M4A4', 'Relic System'], ['Glock-18', 'Vault Key'], ['Desert Eagle', 'Heirloom Brass'], ['USP-S', 'Silent Archive'], ['FAMAS', 'Final Frame'], ['P90', 'Artifact Rush'], ['M4A1-S', 'Old Guard'], ['Karambit', 'Keepsake Edge'], ['MP9', 'Museum Night'], ['SSG 08', 'Last Exhibit']]
};
const tierWeight = { 'Mil-Spec': 6, Restricted: 4, Classified: 2.4, Covert: 1.2, Extraordinary: 0.55 };
export const caseCatalog = cases.map((item, index) => {
  const bonusDrops = variationBlueprints[item.category].map(([family, finish, type, rarity]) =>
    makeDrop(`${family} | ${item.name} - ${finish}`, type, rarity, 0)
  );
  const extraDrops = extraDropBlueprints[item.category].map(([family, finish], offset) =>
    makeDrop(`${family} | ${item.name} - ${finish}`, ['Karambit', 'M9 Bayonet'].includes(family) ? 'knife' : 'weapon', offset > 9 ? 'Covert' : offset > 6 ? 'Classified' : offset > 3 ? 'Restricted' : 'Mil-Spec', 0)
  );
  const allDrops = [...item.drops, ...bonusDrops, ...extraDrops].slice(0, 24);
  const rawWeights = allDrops.map((drop) => tierWeight[drop.rarity] || 1);
  const weightTotal = rawWeights.reduce((sum, value) => sum + value, 0);
  const drops = allDrops.map((drop, dropIndex) => ({ ...drop, chance: Number((rawWeights[dropIndex] / weightTotal * 100).toFixed(2)) }));
  return { ...item, index: index + 1, drops };
});
export const categoryNames = { budget: 'Budget', weapon: 'Weapon', misc: 'Misc' };
export const filters = [
  { id: 'all', label: 'All-in' },
  { id: 'budget', label: 'Budget' },
  { id: 'weapon', label: 'Weapon' },
  { id: 'misc', label: 'Misc' }
];
export function chooseDrop(caseItem) {
  const drops = Array.isArray(caseItem?.drops) ? caseItem.drops.filter((item) => item && Number.isFinite(Number(item.chance)) && Number(item.chance) >= 0) : [];
  if (!drops.length) return makeDrop('Oburena | Emergency Cache', 'weapon', 'Mil-Spec', 100);
  const total = drops.reduce((sum, item) => sum + Number(item.chance), 0);
  if (!(total > 0)) return drops[Math.floor(Math.random() * drops.length)];
  let point = Math.random() * total;
  for (const item of drops) {
    point -= Number(item.chance);
    if (point < 0) return item;
  }
  return drops[drops.length - 1];
}

const wearBands = [
  { condition: 'Factory New', min: 0, max: 699, chance: 8 },
  { condition: 'Minimal Wear', min: 700, max: 1499, chance: 17 },
  { condition: 'Field-Tested', min: 1500, max: 3799, chance: 38 },
  { condition: 'Well-Worn', min: 3800, max: 4499, chance: 18 },
  { condition: 'Battle-Scarred', min: 4500, max: 10000, chance: 19 }
];

export function rollWear(type) {
  if (!['weapon', 'knife', 'gloves'].includes(type)) return null;
  let point = Math.random() * 100;
  let band = wearBands[0];
  for (const option of wearBands) {
    point -= option.chance;
    if (point < 0) { band = option; break; }
  }
  const floatStep = band.min + Math.floor(Math.random() * (band.max - band.min + 1));
  return { condition: band.condition, float: Number((floatStep / 10000).toFixed(4)) };
}

