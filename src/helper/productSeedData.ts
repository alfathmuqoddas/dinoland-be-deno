export const categorySeedData = [
  {
    //id: 1,
    name: "CPU",
    description: "Central Processing Unit",
  },
  {
    //id: 2,
    name: "Graphics Card",
    description: "Graphics Card",
  },
  {
    //id: 3,
    name: "RAM",
    description: "Random Access Memory",
  },
  {
    //id: 4,
    name: "Storage SSD",
    description: "Storage Solid State Drive",
  },
  {
    //id: 5,
    name: "Storage HDD",
    description: "Storage Hard Disk Drive",
  },
  {
    //id: 6,
    name: "Power Supply",
    description: "Power Supply",
  },
  {
    //id: 7,
    name: "Case",
    description: "Case",
  },
  {
    //id: 8,
    name: "Motherboard",
    description: "Motherboard",
  },
  {
    //id: 9,
    name: "CPU Cooler",
    description: "CPU Cooler",
  },
  {
    //id: 10,
    name: "Mouse",
    description: "Mouse",
  },
  {
    //id: 11,
    name: "Keyboard",
    description: "Keyboard",
  },
  {
    //id: 12,
    name: "Monitor",
    description: "Monitor",
  },
];

export const productSeedData = [
  {
    name: "Intel Core i9-13900K",
    description: "24-Core, 32-Thread CPU, Up to 5.8 GHz",
    price: 599.99,
    image: "https://example.com/i9-13900k.jpg",
    categoryId: 1, // CPU
  },
  {
    name: "AMD Ryzen 9 7950X",
    description: "16-Core, 32-Thread CPU, Up to 5.7 GHz",
    price: 649.99,
    image: "https://example.com/r9-7950x.jpg",
    categoryId: 1, // CPU
  },
  {
    name: "AMD Ryzen 5 5600X",
    description: "6-Core, 12-Thread CPU, Up to 4.6 GHz",
    price: 199.99,
    image: "https://example.com/r5-5600x.jpg",
    categoryId: 1, // CPU
  },
  {
    name: "Intel Core i5-13600K",
    description: "14-Core, 20-Thread CPU, Up to 5.1 GHz",
    price: 319.99,
    image: "https://example.com/i5-13600k.jpg",
    categoryId: 1, // CPU
  },
  {
    name: "NVIDIA GeForce RTX 4090",
    description: "24GB GDDR6X, Ray Tracing, DLSS 3",
    price: 1599.99,
    image: "https://example.com/rtx4090.jpg",
    categoryId: 2, // GPU
  },
  {
    name: "AMD Radeon RX 7900 XTX",
    description: "24GB GDDR6, Ray Tracing",
    price: 999.99,
    image: "https://example.com/rx7900xtx.jpg",
    categoryId: 2, // GPU
  },
  {
    name: "NVIDIA GeForce RTX 4070 Ti",
    description: "12GB GDDR6X, Ray Tracing, DLSS 3",
    price: 799.99,
    image: "https://example.com/rtx4070ti.jpg",
    categoryId: 2, // GPU
  },
  {
    name: "AMD Radeon RX 7800 XT",
    description: "16GB GDDR6, Ray Tracing",
    price: 499.99,
    image: "https://example.com/rx7800xt.jpg",
    categoryId: 2, // GPU
  },
  {
    name: "Corsair Vengeance DDR5 32GB (2x16GB) 5600MHz",
    description: "32GB (2x16GB) DDR5 5600MHz CL36",
    price: 149.99,
    image: "https://example.com/corsairddr5.jpg",
    categoryId: 3, // RAM
  },
  {
    name: "G.Skill Trident Z5 Neo DDR5 32GB (2x16GB) 6000MHz",
    description: "32GB (2x16GB) DDR5 6000MHz CL30",
    price: 169.99,
    image: "https://example.com/gskillddr5.jpg",
    categoryId: 3, // RAM
  },
  {
    name: "Kingston Fury Beast DDR5 16GB (2x8GB) 4800MHz",
    description: "16GB (2x8GB) DDR5 4800MHz CL40",
    price: 69.99,
    image: "https://example.com/kingstonfury.jpg",
    categoryId: 3, // RAM
  },
  {
    name: "Crucial Ballistix DDR4 16GB (2x8GB) 3200MHz",
    description: "16GB (2x8GB) DDR4 3200MHz CL16",
    price: 49.99,
    image: "https://example.com/crucialballistix.jpg",
    categoryId: 3, // RAM
  },
  {
    name: "Samsung 990 Pro 1TB NVMe SSD",
    description: "1TB NVMe PCIe 4.0 SSD, Up to 7450MB/s Read",
    price: 139.99,
    image: "https://example.com/samsung990.jpg",
    categoryId: 4, // SSD
  },
  {
    name: "Crucial P5 Plus 2TB NVMe SSD",
    description: "2TB NVMe PCIe 4.0 SSD, Up to 5000MB/s Read",
    price: 179.99,
    image: "https://example.com/crucialp5.jpg",
    categoryId: 4, // SSD
  },
  {
    name: "WD Black SN850X 1TB NVMe SSD",
    description: "1TB NVMe PCIe 4.0 SSD, Up to 7300MB/s Read",
    price: 129.99,
    image: "https://example.com/wdblacksn850x.jpg",
    categoryId: 4, // SSD
  },
  {
    name: "Sabrent Rocket 4 Plus 2TB NVMe SSD",
    description: "2TB NVMe PCIe 4.0 SSD, Up to 7000MB/s Read",
    price: 189.99,
    image: "https://example.com/sabrentrocket4.jpg",
    categoryId: 4, // SSD
  },
  {
    name: "Seagate IronWolf Pro 8TB HDD",
    description: "8TB SATA 7200RPM HDD",
    price: 229.99,
    image: "https://example.com/seagateironwolf.jpg",
    categoryId: 5, // HDD
  },
  {
    name: "WD Red Pro 10TB HDD",
    description: "10TB SATA 7200RPM HDD",
    price: 299.99,
    image: "https://example.com/wdredpro.jpg",
    categoryId: 5, // HDD
  },
  {
    name: "Toshiba X300 16TB HDD",
    description: "16TB SATA 7200RPM HDD",
    price: 499.99,
    image: "https://example.com/toshibax300.jpg",
    categoryId: 5, // HDD
  },
  {
    name: "Seagate Barracuda 2TB HDD",
    description: "2TB SATA 5400RPM HDD",
    price: 59.99,
    image: "https://example.com/seagatebarracuda.jpg",
    categoryId: 5, // HDD
  },
  {
    name: "Corsair RM1000x (2021) 1000W PSU",
    description: "1000W 80+ Gold Certified Fully Modular PSU",
    price: 199.99,
    image: "https://example.com/corsairrm1000x.jpg",
    categoryId: 6, // PSU
  },
  {
    name: "Seasonic PRIME TX-1000 1000W PSU",
    description: "1000W 80+ Titanium Certified Fully Modular PSU",
    price: 299.99,
    image: "https://example.com/seasonictx1000.jpg",
    categoryId: 6, // PSU
  },
  {
    name: "EVGA SuperNOVA 850 G6 850W PSU",
    description: "850W 80+ Gold Certified Fully Modular PSU",
    price: 149.99,
    image: "https://example.com/evgasupernova.jpg",
    categoryId: 6, // PSU
  },
  {
    name: "Cooler Master MWE Gold 750 750W PSU",
    description: "750W 80+ Gold Certified Semi-Modular PSU",
    price: 109.99,
    image: "https://example.com/coolermastermwe.jpg",
    categoryId: 6, // PSU
  },
  {
    name: "NZXT H710i Case",
    description: "Mid-Tower ATX Case",
    price: 169.99,
    image: "https://example.com/nzxth710i.jpg",
    categoryId: 7, // Case
  },
  {
    name: "Fractal Design Define 7 XL Case",
    description: "Full-Tower ATX Case",
    price: 249.99,
    image: "https://example.com/fractaldefine7xl.jpg",
    categoryId: 7, // Case
  },
  {
    name: "Lian Li O11 Dynamic Evo Case",
    description: "Mid-Tower ATX Case",
    price: 179.99,
    image: "https://example.com/lianlio11.jpg",
    categoryId: 7, // Case
  },
  {
    name: "Corsair 4000D Airflow Case",
    description: "Mid-Tower ATX Case",
    price: 99.99,
    image: "https://example.com/corsair4000d.jpg",
    categoryId: 7, // Case
  },
  {
    name: "ASUS ROG Maximus Z790 Extreme Motherboard",
    description: "Intel Z790 Chipset Motherboard",
    price: 799.99,
    image: "https://example.com/asusmaximus.jpg",
    categoryId: 8, // Motherboard
  },
  {
    name: "MSI MEG X670E Godlike Motherboard",
    description: "AMD X670E Chipset Motherboard",
    price: 699.99,
    image: "https://example.com/msigodlike.jpg",
    categoryId: 8, // Motherboard
  },
  {
    name: "Gigabyte Z790 AORUS Master Motherboard",
    description: "Intel Z790 Chipset Motherboard",
    price: 499.99,
    image: "https://example.com/gigabytez790.jpg",
    categoryId: 8, // Motherboard
  },
  {
    name: "ASRock B650E Steel Legend Motherboard",
    description: "AMD B650E Chipset Motherboard",
    price: 299.99,
    image: "https://example.com/asrockb650e.jpg",
    categoryId: 8, // Motherboard
  },
  {
    name: "Noctua NH-D15 CPU Cooler",
    description: "High-Performance Air Cooler",
    price: 99.99,
    image: "https://example.com/noctuad15.jpg",
    categoryId: 9, // CPU Cooler
  },
  {
    name: "Corsair iCUE H150i Elite LCD XT AIO Cooler",
    description: "360mm AIO Liquid Cooler",
    price: 279.99,
    image: "https://example.com/corsairh150i.jpg",
    categoryId: 9, // CPU Cooler
  },
  {
    name: "be quiet! Dark Rock Pro 4 CPU Cooler",
    description: "High-Performance Air Cooler",
    price: 89.99,
    image: "https://example.com/bequietdarkrock.jpg",
    categoryId: 9, // CPU Cooler
  },
  {
    name: "Arctic Liquid Freezer II 280 CPU Cooler",
    description: "280mm AIO Liquid Cooler",
    price: 129.99,
    image: "https://example.com/arcticliquidfreezer.jpg",
    categoryId: 9, // CPU Cooler
  },
  {
    name: "Logitech G903 Wireless Gaming Mouse",
    description: "Wireless Gaming Mouse",
    price: 129.99,
    image: "https://example.com/logitechg903.jpg",
    categoryId: 10, // Mouse
  },
  {
    name: "Razer DeathAdder V3 Pro Wireless Gaming Mouse",
    description: "Wireless Gaming Mouse",
    price: 149.99,
    image: "https://example.com/razerdeathadder.jpg",
    categoryId: 10, // Mouse
  },
  {
    name: "Glorious Model O Wireless Gaming Mouse",
    description: "Lightweight Wireless Gaming Mouse",
    price: 79.99,
    image: "https://example.com/gloriousmodelo.jpg",
    categoryId: 10, // Mouse
  },
  {
    name: "SteelSeries Aerox 3 Wireless Gaming Mouse",
    description: "Lightweight Wireless Gaming Mouse",
    price: 99.99,
    image: "https://example.com/steelseriesaerox3.jpg",
    categoryId: 10, // Mouse
  },
  {
    name: "Corsair K100 RGB Mechanical Gaming Keyboard",
    description: "Mechanical Gaming Keyboard",
    price: 199.99,
    image: "https://example.com/corsairk100.jpg",
    categoryId: 11, // Keyboard
  },
  {
    name: "Razer Huntsman V2 Analog Gaming Keyboard",
    description: "Optical Gaming Keyboard",
    price: 179.99,
    image: "https://example.com/razerhuntsman.jpg",
    categoryId: 11, // Keyboard
  },
  {
    name: "Logitech G915 TKL Wireless Mechanical Gaming Keyboard",
    description: "Wireless Mechanical Gaming Keyboard",
    price: 229.99,
    image: "https://example.com/logitechg915.jpg",
    categoryId: 11, // Keyboard
  },
  {
    name: "Keychron K2 Wireless Mechanical Keyboard",
    description: "Wireless Mechanical Keyboard",
    price: 89.99,
    image: "https://example.com/keychronk2.jpg",
    categoryId: 11, // Keyboard
  },
  {
    name: "ASUS ROG Swift PG279QM Gaming Monitor",
    description: "27-inch 1440p 240Hz Gaming Monitor",
    price: 699.99,
    image: "https://example.com/asuspg279qm.jpg",
    categoryId: 12, // Monitor
  },
  {
    name: "LG 27GP950-B Gaming Monitor",
    description: "27-inch 4K 144Hz Gaming Monitor",
    price: 799.99,
    image: "https://example.com/lg27gp950.jpg",
    categoryId: 12, // Monitor
  },
  {
    name: "Samsung Odyssey Neo G9 Gaming Monitor",
    description: "49-inch Super Ultrawide 240Hz Gaming Monitor",
    price: 2499.99,
    image: "https://example.com/samsungodysseyneog9.jpg",
    categoryId: 12, // Monitor
  },
  {
    name: "Dell Alienware AW3423DW Gaming Monitor",
    description: "34-inch Ultrawide 175Hz Gaming Monitor",
    price: 2499.99,
    image: "https://example.com/dellaw3423dw.jpg",
    categoryId: 12, // Monitor
  },
];
