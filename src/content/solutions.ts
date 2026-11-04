import type { Locale } from '../i18n';

type L = Record<Locale, string>;
type LList = Record<Locale, string[]>;

export interface Solution {
  slug: string;
  name: L; // short label used in nav and cards
  title: L;
  summary: L;
  body: L;
  capabilities: LList;
  /** Real process steps, shown in order on the detail page. `image.file` names a screenshot in src/assets/img/solutions (coffee Lampung demo). */
  process?: { title: L; body: L; image?: { file: string; alt: L } }[];
}

// Copy carried over from the old /solutions/ page. Indonesian is a first translation for review.
export const solutions: Solution[] = [
  {
    slug: 'embedded-finance',
    name: { en: 'Embedded finance', id: 'Pembiayaan terintegrasi' },
    title: { en: 'Embedded finance & trade credit (Talangin)', id: 'Pembiayaan & kredit dagang terintegrasi (Talangin)' },
    summary: {
      en: 'Short-term working capital and trade credit built into every transaction.',
      id: 'Modal kerja jangka pendek dan kredit dagang yang menyatu dengan setiap transaksi.',
    },
    body: {
      en: 'PasarMIKRO funds trades in real time for verified users, so buyers and suppliers can trade faster, safer and at larger volumes.',
      id: 'PasarMIKRO mendanai transaksi secara real time untuk pengguna terverifikasi, sehingga pembeli dan pemasok dapat berdagang lebih cepat, aman, dan dalam volume lebih besar.',
    },
    capabilities: {
      en: [
        'Talangin working capital for inputs, stock procurement and order fulfilment',
        'Credit scoring from transaction history and partner verification',
        'Deferred-payment (TOP) bridging for trusted buyers and suppliers',
        'Advance PO financing and invoice-based settlement',
      ],
      id: [
        'Modal kerja Talangin untuk input, pengadaan stok, dan pemenuhan pesanan',
        'Penilaian kredit dari riwayat transaksi dan verifikasi mitra',
        'Jembatan pembayaran tempo (TOP) untuk pembeli dan pemasok tepercaya',
        'Pembiayaan PO di muka dan penyelesaian berbasis faktur',
      ],
    },
    // Step text from the Talangin trade credit process diagram on the old site.
    process: [
      {
        title: { en: 'Purchase order', id: 'Pesanan pembelian' },
        body: { en: 'The processor issues a PO.', id: 'Pengolah menerbitkan PO.' },
        image: { file: 'contract-detail', alt: { en: 'Detail Project screen for an export contract of 45 tonnes of Robusta Lampung G4 with PT Selat Sunda Coffee Export', id: 'Layar Detail Project untuk kontrak ekspor 45 ton Robusta Lampung G4 dengan PT Selat Sunda Coffee Export' } },
      },
      {
        title: { en: 'Credit allocation', id: 'Alokasi kredit' },
        body: { en: 'Up to 90% of the contract value is made available as credit.', id: 'Hingga 90% dari nilai kontrak tersedia sebagai kredit.' },
        image: { file: 'talangin-limit', alt: { en: 'Home screen of the PasarMIKRO app with the buying wallet, the business wallet and the available Talangin credit', id: 'Beranda aplikasi PasarMIKRO dengan uang belanja, uang usaha, dan kredit Talangin yang tersedia' } },
      },
      {
        title: { en: 'Commodity purchase', id: 'Pembelian komoditas' },
        body: { en: 'Suppliers buy the commodities from farmers.', id: 'Pemasok membeli komoditas dari petani.' },
        image: { file: 'purchase-in-escrow', alt: { en: 'Purchase of 500 kg of robusta from a farmer, paid with Talangin and waiting for the seller to process it', id: 'Pembelian 500 kg robusta dari petani, dibayar dengan Talangin dan menunggu diproses penjual' } },
      },
      {
        title: { en: 'Delivery confirmation', id: 'Konfirmasi pengiriman' },
        body: { en: 'The processor confirms the goods were received.', id: 'Pengolah mengonfirmasi barang telah diterima.' },
        image: { file: 'confirm-arrival', alt: { en: 'Window to confirm the goods arrived, with a regular or instant payout to the seller and an optional photo as proof', id: 'Jendela konfirmasi barang sampai, dengan pembayaran reguler atau instan ke penjual dan foto bukti opsional' } },
      },
      {
        title: { en: 'Final invoice', id: 'Faktur akhir' },
        body: { en: 'The invoice is verified in the PasarMIKRO app.', id: 'Faktur diverifikasi di aplikasi PasarMIKRO.' },
        image: { file: 'loan-detail', alt: { en: 'Talangin bill detail with the amount still owed, the share already paid and a timeline of the loan', id: 'Detail tagihan Talangin dengan sisa tagihan, bagian yang sudah dibayar, dan alur pinjaman' } },
      },
      {
        title: { en: 'Payment settlement', id: 'Penyelesaian pembayaran' },
        body: { en: 'The processor settles the supplier’s invoice.', id: 'Pengolah melunasi faktur pemasok.' },
        image: { file: 'pay-loan', alt: { en: 'Bayar Tagihan window where the amount to repay is entered, in part or in full', id: 'Jendela Bayar Tagihan untuk mengisi jumlah yang dibayar, sebagian atau penuh' } },
      },
    ],
  },
  {
    slug: 'trusted-trade',
    name: { en: 'Trusted trade', id: 'Perdagangan tepercaya' },
    title: { en: 'Trusted trade facilitation', id: 'Fasilitasi perdagangan tepercaya' },
    summary: {
      en: 'Secure, transparent workflows from deal confirmation to settlement.',
      id: 'Alur kerja yang aman dan transparan dari konfirmasi kesepakatan hingga penyelesaian.',
    },
    body: {
      en: 'Core digital infrastructure that lets informal traders and supply-chain actors transact with confidence in fulfilment, payment and traceability.',
      id: 'Infrastruktur digital inti yang memungkinkan pedagang informal dan pelaku rantai pasok bertransaksi dengan yakin atas pemenuhan, pembayaran, dan ketertelusuran.',
    },
    capabilities: {
      en: ['Deal confirmation workflows', 'Transaction tracking and proof', 'Notifications and payment anchoring', 'Integrated logistics and settlement'],
      id: ['Alur konfirmasi kesepakatan', 'Pelacakan dan bukti transaksi', 'Notifikasi dan penjaminan pembayaran', 'Logistik dan penyelesaian terintegrasi'],
    },
    process: [
      {
        title: { en: 'Choose a verified seller', id: 'Pilih penjual terverifikasi' },
        body: { en: 'Sellers come from your contact list, and the app shows whether each one is verified.', id: 'Penjual dipilih dari daftar kontak Anda, dan aplikasi menunjukkan apakah penjual sudah terverifikasi.' },
        image: { file: 'seller-verified', alt: { en: 'Purchase form with a coffee farmer chosen as the seller and a Terverifikasi (verified) badge', id: 'Formulir pembelian dengan petani kopi sebagai penjual dan lencana Terverifikasi' } },
      },
      {
        title: { en: 'The seller confirms first', id: 'Penjual mengonfirmasi lebih dulu' },
        body: { en: 'A new purchase waits for the seller to process it before it moves on.', id: 'Pembelian baru menunggu diproses penjual sebelum berlanjut.' },
        image: { file: 'seller-processing', alt: { en: 'Purchase detail for 400 kg of robusta with the status Menunggu Proses Penjual (waiting for the seller)', id: 'Detail pembelian 400 kg robusta dengan status Menunggu Proses Penjual' } },
      },
      {
        title: { en: 'Track every deal', id: 'Pantau setiap transaksi' },
        body: { en: 'Every purchase is listed with its seller, goods, inventory code and lot ID.', id: 'Setiap pembelian tercatat dengan penjual, barang, kode inventori, dan lot ID.' },
        image: { file: 'transaction-list', alt: { en: 'Daftar Transaksi screen listing coffee purchases with sellers, quantities, prices and lot IDs', id: 'Layar Daftar Transaksi berisi pembelian kopi dengan penjual, jumlah, harga, dan lot ID' } },
      },
    ],
  },
  {
    slug: 'risk-credit',
    name: { en: 'Risk & credit', id: 'Risiko & kredit' },
    title: { en: 'Counterparty risk & credit assessment', id: 'Penilaian risiko & kredit mitra' },
    summary: {
      en: 'Digital profiling, KYC and credit scoring for safer lending and trade.',
      id: 'Profil digital, KYC, dan penilaian kredit untuk pembiayaan dan perdagangan yang lebih aman.',
    },
    body: {
      en: 'Due diligence and creditworthiness assessment at onboarding and continuously through behaviour tracking.',
      id: 'Uji tuntas dan penilaian kelayakan kredit saat pendaftaran dan secara berkelanjutan melalui pemantauan perilaku.',
    },
    capabilities: {
      en: ['KYC/AML data collection', 'Dynamic credit scoring', 'Buyer-verified trust tagging', 'Behavioural history and repayment reliability'],
      id: ['Pengumpulan data KYC/AML', 'Penilaian kredit dinamis', 'Penandaan kepercayaan terverifikasi pembeli', 'Riwayat perilaku dan keandalan pembayaran'],
    },
    process: [
      {
        title: { en: 'Verify every member', id: 'Verifikasi setiap anggota' },
        body: { en: 'See how many members are verified, with each farmer’s group and status. Contact details are blurred here.', id: 'Lihat berapa anggota yang sudah terverifikasi, lengkap dengan kelompok dan status setiap petani. Data kontak diburamkan di sini.' },
        image: { file: 'member-register', alt: { en: 'Daftar Anggota screen showing 63 members, 60 of them verified, with each farmer group and status', id: 'Layar Daftar Anggota dengan 63 anggota, 60 di antaranya terverifikasi, lengkap dengan kelompok dan status' } },
      },
      {
        title: { en: 'Know each farmer', id: 'Kenali setiap petani' },
        body: { en: 'Each member record holds the farmer’s role, group, birth date and gender, with identity documents.', id: 'Setiap data anggota memuat peran, kelompok, tanggal lahir, dan jenis kelamin petani, beserta dokumen identitas.' },
        image: { file: 'member-record', alt: { en: 'Member record of a coffee farmer in a women farmers group, marked as verified', id: 'Data anggota seorang petani kopi di kelompok wanita tani, berstatus terverifikasi' } },
      },
      {
        title: { en: 'Follow repayment', id: 'Pantau pembayaran kembali' },
        body: { en: 'Every Talangin loan shows whether it is paid, open, extended or late.', id: 'Setiap pinjaman Talangin menunjukkan apakah sudah lunas, belum lunas, diperpanjang, atau terlambat.' },
        image: { file: 'loan-book', alt: { en: 'Tagihan Talangin screen listing loans with due dates and statuses such as Belum Lunas, Lunas and Terlambat 3 hari', id: 'Layar Tagihan Talangin berisi pinjaman dengan jatuh tempo dan status seperti Belum Lunas, Lunas, dan Terlambat 3 hari' } },
      },
      {
        title: { en: 'Back the limit with stock', id: 'Jamin limit dengan stok' },
        body: { en: 'Repo Barang requests raise the credit limit against coffee held in stock and a buyer’s order.', id: 'Pengajuan Repo Barang menaikkan limit kredit berdasarkan kopi di gudang dan pesanan pembeli.' },
        image: { file: 'repo-requests', alt: { en: 'Daftar Pengajuan Repo screen with two requests backed by Robusta Lampung G4 stock', id: 'Layar Daftar Pengajuan Repo dengan dua pengajuan berjaminan stok Robusta Lampung G4' } },
      },
    ],
  },
  {
    slug: 'field-verification',
    name: { en: 'Field verification', id: 'Verifikasi lapangan' },
    title: { en: 'Field verification & inspection', id: 'Verifikasi & inspeksi lapangan' },
    summary: {
      en: 'On-the-ground stock surveys, inspections and sourcing checks.',
      id: 'Survei stok, inspeksi, dan pemeriksaan sumber langsung di lapangan.',
    },
    body: {
      en: 'Our field operations team runs physical checks of inventories, facilities and logistics, so buyers and funders can rely on more than the digital record.',
      id: 'Tim operasional lapangan kami melakukan pemeriksaan fisik atas stok, fasilitas, dan logistik, sehingga pembeli dan pendana tidak hanya mengandalkan catatan digital.',
    },
    capabilities: {
      en: ['Stock counting before financing', 'Warehouse and facility inspections for buyers or funders', 'Site verification for sourcing programs'],
      id: ['Penghitungan stok sebelum pembiayaan', 'Inspeksi gudang dan fasilitas untuk pembeli atau pendana', 'Verifikasi lokasi untuk program sumber pasok'],
    },
    process: [
      {
        title: { en: 'Map every garden', id: 'Petakan setiap kebun' },
        body: { en: 'Members’ gardens appear on a satellite map, with the size of each plot.', id: 'Kebun anggota tampil di peta satelit, lengkap dengan luas setiap lahan.' },
        image: { file: 'garden-map', alt: { en: 'Satellite map with red pins on members’ coffee gardens in West Lampung, next to a list of members and plot sizes', id: 'Peta satelit dengan pin merah di kebun kopi anggota di Lampung Barat, di samping daftar anggota dan luas lahan' } },
      },
      {
        title: { en: 'Check forest cover', id: 'Cek tutupan hutan' },
        body: { en: 'A garden whose forest cover has dropped is flagged for a closer look.', id: 'Kebun yang tutupan hutannya berkurang ditandai untuk dicek lebih lanjut.' },
        image: { file: 'forest-check', alt: { en: 'Satellite map with one member’s garden opened, showing a drop in forest area since the last update', id: 'Peta satelit dengan kebun salah satu anggota terbuka, menunjukkan luas hutan yang berkurang sejak pembaruan terakhir' } },
      },
    ],
  },
  {
    slug: 'trade-insurance',
    name: { en: 'Trade insurance', id: 'Asuransi dagang' },
    title: { en: 'Integrated trade insurance', id: 'Asuransi dagang terintegrasi' },
    summary: {
      en: 'Cargo, warehouse and crop-linked protection for smallholder trade.',
      id: 'Perlindungan kargo, gudang, dan hasil panen untuk perdagangan petani kecil.',
    },
    body: {
      en: 'Access to insurance designed for smallholder-linked trade risk, including loss, damage and liability.',
      id: 'Akses ke asuransi yang dirancang untuk risiko perdagangan petani kecil, termasuk kehilangan, kerusakan, dan tanggung gugat.',
    },
    capabilities: {
      en: ['Cargo and transit insurance', 'Warehouse and storage insurance', 'Crop and harvest-linked coverage (coming)'],
      id: ['Asuransi kargo dan pengiriman', 'Asuransi gudang dan penyimpanan', 'Perlindungan terkait panen (segera)'],
    },
    process: [
      {
        title: { en: 'Payment held in escrow', id: 'Pembayaran ditahan di escrow' },
        body: { en: 'While the seller processes the order, the payment stays held and the buyer can still adjust the order.', id: 'Selama penjual memproses pesanan, pembayaran tetap ditahan dan pembeli masih bisa menyesuaikan pesanan.' },
        image: { file: 'purchase-in-escrow', alt: { en: 'Purchase of 500 kg of robusta paid with Talangin, status Diproses oleh Penjual, with buttons to confirm arrival or adjust the order', id: 'Pembelian 500 kg robusta yang dibayar dengan Talangin, berstatus Diproses oleh Penjual, dengan tombol konfirmasi barang sampai atau penyesuaian pesanan' } },
      },
      {
        title: { en: 'Released on confirmed delivery', id: 'Dicairkan setelah barang diterima' },
        body: { en: 'The buyer confirms the goods arrived, can add a photo as proof, and only then is the seller paid.', id: 'Pembeli mengonfirmasi barang sampai, bisa menambahkan foto sebagai bukti, dan baru setelah itu penjual dibayar.' },
        image: { file: 'confirm-arrival', alt: { en: 'Window to confirm the goods arrived, with payout options for the seller and an optional proof photo', id: 'Jendela konfirmasi barang sampai, dengan pilihan pembayaran ke penjual dan foto bukti opsional' } },
      },
    ],
  },
  {
    slug: 'program-delivery',
    name: { en: 'Program delivery', id: 'Pelaksanaan program' },
    title: { en: 'Traceability & digitization programs', id: 'Program ketertelusuran & digitalisasi' },
    summary: {
      en: 'Co-designed sourcing, traceability and inclusion programs with global partners.',
      id: 'Program sumber pasok, ketertelusuran, dan inklusi yang dirancang bersama mitra global.',
    },
    body: {
      en: 'We co-develop and implement digitization programs for inclusive sourcing, traceability and financial inclusion with large buyers and institutions.',
      id: 'Kami mengembangkan dan menjalankan program digitalisasi untuk sumber pasok inklusif, ketertelusuran, dan inklusi keuangan bersama pembeli besar dan institusi.',
    },
    capabilities: {
      en: [
        'Rattan supply chain and home-weaver digitization',
        'Palm sugar traceability and sourcing compliance',
        'Upcoming work in cocoa, rice, kapok and seaweed',
      ],
      id: [
        'Rantai pasok rotan dan digitalisasi penganyam rumahan',
        'Ketertelusuran gula aren dan kepatuhan sumber pasok',
        'Program mendatang untuk kakao, beras, kapuk, dan rumput laut',
      ],
    },
    process: [
      {
        title: { en: 'Link purchases to a contract', id: 'Hubungkan pembelian dengan kontrak' },
        body: { en: 'An export contract sits above the village collection projects, so each purchase counts toward it.', id: 'Kontrak ekspor menjadi induk dari proyek pengumpulan di desa, sehingga setiap pembelian tercatat untuk kontrak itu.' },
        image: { file: 'projects', alt: { en: 'Daftar Projects screen with an export contract and five village collection projects linked to it', id: 'Layar Daftar Projects dengan satu kontrak ekspor dan lima proyek pengumpulan desa yang terhubung' } },
      },
      {
        title: { en: 'Record processing', id: 'Catat proses pengolahan' },
        body: { en: 'Each drying, sorting and packing step is recorded with the lots that go in and come out.', id: 'Setiap tahap pengeringan, sortasi, dan pengemasan tercatat bersama lot yang masuk dan keluar.' },
        image: { file: 'processing-report', alt: { en: 'Laporan Proses screen listing re-drying, sorting and export packing steps with their lot IDs', id: 'Layar Laporan Proses berisi tahap pengeringan ulang, sortasi, dan pengemasan lot ekspor dengan lot ID' } },
      },
      {
        title: { en: 'Trace the export lot', id: 'Telusuri lot ekspor' },
        body: { en: 'An export lot traces back through the graded coffee and bags to the farmer purchases.', id: 'Lot ekspor ditelusuri lewat kopi hasil sortir dan karung sampai ke pembelian dari petani.' },
        image: { file: 'lot-trace', alt: { en: 'Laporan Ketelusuran for a 12-tonne export lot of robusta G4, listing the source materials it was made from', id: 'Laporan Ketelusuran untuk lot ekspor robusta G4 sebanyak 12 ton, berisi bahan sumber yang dipakai' } },
      },
      {
        title: { en: 'Run trainings', id: 'Jalankan pelatihan' },
        body: { en: 'Field schools, trainings and outreach sessions are kept on one timeline.', id: 'Sekolah lapang, pelatihan, dan sosialisasi tercatat dalam satu linimasa.' },
        image: { file: 'events', alt: { en: 'Timeline Event screen with a field school, a cherry-picking training, an EUDR session and a financial literacy training', id: 'Layar Timeline Event dengan sekolah lapang, pelatihan petik merah, sosialisasi EUDR, dan pelatihan literasi keuangan' } },
      },
    ],
  },
  {
    slug: 'institutional-tools',
    name: { en: 'Institutional tools', id: 'Solusi institusi' },
    title: { en: 'Institutional deployment & white-label', id: 'Penerapan institusi & white-label' },
    summary: {
      en: 'Custom deployments and dashboards for processors, cooperatives, NGOs and DFIs.',
      id: 'Penerapan khusus dan dasbor untuk pengolah, koperasi, LSM, dan lembaga pembiayaan pembangunan.',
    },
    body: {
      en: 'A platform set up around your organisation, with your own workflows, data and reporting.',
      id: 'Platform yang disesuaikan dengan organisasi Anda, dengan alur kerja, data, dan pelaporan Anda sendiri.',
    },
    capabilities: {
      en: ['Mirror databases', 'Custom workflows', 'Reporting dashboards', 'Embedded monitoring tools'],
      id: ['Basis data cermin', 'Alur kerja khusus', 'Dasbor pelaporan', 'Alat pemantauan terintegrasi'],
    },
    process: [
      {
        title: { en: 'Monitor worker compliance', id: 'Pantau kepatuhan pekerja' },
        body: { en: 'The ESG dashboard scores contracts, insurance, minimum age, hours and wages for each team.', id: 'Dashboard ESG memberi skor kontrak, asuransi, usia minimum, jam kerja, dan upah untuk setiap tim.' },
        image: { file: 'esg-dashboard', alt: { en: 'ESG dashboard for a warehouse team with scores for contract, insurance, minimum age, work hours, minimum wage, payment logs and productivity', id: 'Dashboard ESG untuk tim gudang dengan skor kontrak, asuransi, usia minimum, jam kerja, upah minimum, catatan pembayaran, dan produktivitas' } },
      },
      {
        title: { en: 'See stock across the network', id: 'Lihat stok di seluruh jaringan' },
        body: { en: 'Inventory intelligence lists every warehouse with its owner, stock and value.', id: 'Inventory intelligence menampilkan setiap gudang dengan pemilik, stok, dan nilainya.' },
        image: { file: 'inventory-overview', alt: { en: 'Inventory Intelligence screen listing four warehouses with their owners, item counts, quantities and values', id: 'Layar Inventory Intelligence berisi empat gudang dengan pemilik, jumlah jenis barang, kuantitas, dan nilainya' } },
      },
      {
        title: { en: 'Compare buying and selling', id: 'Bandingkan pembelian dan penjualan' },
        body: { en: 'The transaction summary shows total purchases, sales and margin, month by month.', id: 'Ringkasan transaksi menampilkan total pembelian, penjualan, dan selisih, per bulan.' },
        image: { file: 'transaction-summary', alt: { en: 'Ringkasan Transaksi screen with total purchases, sales and margin, and a monthly bar chart of purchases against sales', id: 'Layar Ringkasan Transaksi dengan total pembelian, penjualan, dan selisih, serta grafik batang bulanan pembelian dan penjualan' } },
      },
    ],
  },
  {
    slug: 'mikro-erp',
    name: { en: 'Mikro ERP', id: 'Mikro ERP' },
    title: { en: 'Mikro ERP', id: 'Mikro ERP' },
    summary: {
      en: 'Mobile-first ERP for smallholder-based agri-businesses and cooperatives.',
      id: 'ERP berbasis ponsel untuk usaha agri dan koperasi berbasis petani kecil.',
    },
    body: {
      en: 'Digitize purchases, sales, inventory, orders and payments, and connect that data to PasarMIKRO finance and traceability.',
      id: 'Digitalkan pembelian, penjualan, stok, pesanan, dan pembayaran, lalu hubungkan datanya dengan pembiayaan dan ketertelusuran PasarMIKRO.',
    },
    capabilities: {
      en: [
        'Inventory and order management',
        'Simple ledger for receivables, payables and cash flow',
        'Direct link to the PasarMIKRO marketplace and financing',
        'Multi-user access for managers, traders and staff',
      ],
      id: [
        'Manajemen stok dan pesanan',
        'Pembukuan sederhana untuk piutang, utang, dan arus kas',
        'Terhubung langsung dengan marketplace dan pembiayaan PasarMIKRO',
        'Akses multi-pengguna untuk pengelola, pedagang, dan staf',
      ],
    },
    process: [
      {
        title: { en: 'Manage stock by warehouse', id: 'Kelola stok per gudang' },
        body: { en: 'Stock is grouped by warehouse, with each lot’s goods, quantity and inventory code.', id: 'Stok dikelompokkan per gudang, lengkap dengan barang, jumlah, dan kode inventori setiap lot.' },
        image: { file: 'warehouse-stock', alt: { en: 'Inventori screen for a coffee warehouse listing stock such as Kopi Asalan Kering, Robusta Lampung G4 and export lots', id: 'Layar Inventori untuk gudang kopi berisi stok seperti Kopi Asalan Kering, Robusta Lampung G4, dan lot ekspor' } },
      },
      {
        title: { en: 'Keep receivables and payables', id: 'Catat piutang dan utang' },
        body: { en: 'See what is still owed to you, invoice by invoice.', id: 'Lihat piutang yang belum dibayar, per faktur.' },
        image: { file: 'receivables', alt: { en: 'Manajemen Utang Piutang screen with the remaining receivables and a list of invoices', id: 'Layar Manajemen Utang Piutang dengan sisa piutang dan daftar faktur' } },
      },
      {
        title: { en: 'Follow the buying wallet', id: 'Pantau uang belanja' },
        body: { en: 'Every top-up, payment and fee in the buying wallet is listed by date.', id: 'Setiap penambahan saldo, pembayaran, dan biaya di uang belanja tercatat per tanggal.' },
        image: { file: 'buying-wallet', alt: { en: 'Uang Belanja screen with the balance and a dated history of payments, fees, tax and top-ups', id: 'Layar Uang Belanja dengan saldo dan riwayat pembayaran, biaya, pajak, dan penambahan saldo per tanggal' } },
      },
      {
        title: { en: 'Track a sale on credit', id: 'Pantau penjualan kredit' },
        body: { en: 'A sale on credit shows what has been paid and what is still outstanding.', id: 'Penjualan kredit menunjukkan bagian yang sudah dibayar dan yang masih tersisa.' },
        image: { file: 'receivable-detail', alt: { en: 'Detail Piutang for a sale of an export lot to a coffee exporter, half paid, with its payment history', id: 'Detail Piutang untuk penjualan lot ekspor ke eksportir kopi, sudah dibayar setengah, dengan riwayat pembayarannya' } },
      },
    ],
  },
];
