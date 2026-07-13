import React, { useState } from 'react';
import { Copy, Download, Check, Github, Settings, Terminal, FileCode2, ChevronDown, FolderGit2, Globe, Code2, Info, ZoomIn, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [branch, setBranch] = useState('main');
  const [nodeVersion, setNodeVersion] = useState('24');
  const [packageManager, setPackageManager] = useState('npm');
  const [useLockFile, setUseLockFile] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(1);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const InteractiveImage = ({ src, alt }: { src: string; alt: string }) => {
    const highResSrc = src.includes('=w') ? src : `${src}=w1600`;
    return (
      <div 
        className="relative group cursor-zoom-in overflow-hidden rounded-xl border border-slate-200 shadow-md bg-white transition-all hover:shadow-lg hover:border-blue-400 mt-2 max-w-2xl w-full"
        onClick={() => setZoomImage(highResSrc)}
      >
        <img 
          src={highResSrc} 
          alt={alt} 
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]" 
          referrerPolicy="no-referrer" 
        />
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs backdrop-blur-[1px]">
          <ZoomIn className="w-4 h-4" /> Bấm để xem ảnh phóng to rõ nét
        </div>
      </div>
    );
  };

  const getInstallCommand = () => {
    if (useLockFile) {
      switch (packageManager) {
        case 'yarn': return 'yarn install --frozen-lockfile';
        case 'pnpm': return 'pnpm install --frozen-lockfile';
        default: return 'npm ci';
      }
    } else {
      switch (packageManager) {
        case 'yarn': return 'yarn install';
        case 'pnpm': return 'pnpm install';
        default: return 'npm install';
      }
    }
  };

  const getBuildCommand = () => {
    switch (packageManager) {
      case 'yarn': return 'yarn build';
      case 'pnpm': return 'pnpm build';
      default: return 'npm run build';
    }
  };

  const yamlContent = `name: Deploy to GitHub Pages

on:
  # Chạy workflow khi có push vào nhánh được chọn
  push:
    branches: [ "${branch}" ]
  # Cho phép chạy workflow thủ công từ tab Actions
  workflow_dispatch:

# Cấp quyền cho GITHUB_TOKEN để deploy lên GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Chỉ cho phép một deploy chạy tại một thời điểm
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${nodeVersion}${useLockFile ? `\n          cache: '${packageManager}'` : ''}
          
      - name: Install dependencies
        run: ${getInstallCommand()}
        
      - name: Build project
        run: ${getBuildCommand()}
        
      - name: Setup GitHub Pages
        uses: actions/configure-pages@v5
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          # Đường dẫn thư mục build của Vite mặc định là 'dist'
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(yamlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deploy.yml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const viteConfigExample = `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    // 👇 BẮT BUỘC: Thêm dòng này để sửa lỗi trắng trang (404)
    // Thay 'ten-repo-cua-ban' bằng tên repository thực tế trên GitHub
    base: '/ten-repo-cua-ban/',
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});`;

  const steps = [
    {
      id: 1,
      title: 'Export từ Google AI Studio',
      shortDesc: 'Đẩy code lên một repository mới trên GitHub.',
      icon: <FolderGit2 className="w-4 h-4" />,
      color: 'blue',
      content: (
        <div className="space-y-3 mt-3 text-sm text-slate-600">
          <p>Để đưa code từ Google AI Studio lên GitHub, bạn có 2 cách:</p>
          <div className="bg-slate-800 rounded-lg p-4 text-slate-300 font-medium flex flex-col gap-3 border border-slate-700 shadow-inner">
            <div className="flex items-start gap-3">
              <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs border border-blue-500/30 whitespace-nowrap">Cách 1</span>
              <div className="flex flex-col gap-2 w-full">
                <span className="leading-relaxed">Nhấn menu <strong>Settings</strong> (biểu tượng ⚙️ góc phải trên cùng) &rarr; Chọn <strong>GitHub</strong> và làm theo hình. Cách này thuận tiện hơn.</span>
                <InteractiveImage src="https://lh3.googleusercontent.com/d/1uQS1uKV9XKCUCp5pqIKamCRXELWQUlg6" alt="Hướng dẫn Export GitHub" />
              </div>
            </div>
            <div className="h-px bg-slate-700/50 w-full"></div>
            <div className="flex items-start gap-3">
              <span className="bg-slate-600/40 text-slate-300 px-2 py-0.5 rounded text-xs border border-slate-500/30 whitespace-nowrap">Cách 2</span>
              <span className="leading-relaxed">Chọn tab <strong>Code</strong>, rồi nhấn biểu tượng <strong>Download</strong> cạnh biểu tượng ⚙️ (menu Settings) để tải file Zip về máy tính, &rarr; Giải nén &rarr; Tự tạo repo mới trên GitHub và push code lên bằng Git.</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Cấu hình GitHub Pages',
      shortDesc: 'Bật tính năng deploy bằng GitHub Actions trên kho lưu trữ.',
      icon: <Globe className="w-4 h-4" />,
      color: 'blue',
      content: (
        <div className="space-y-3 mt-3 text-sm text-slate-600">
          <div className="flex flex-wrap gap-2 pb-1">
            <a 
              href="https://github.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 bg-[#24292e] hover:bg-[#1a1e22] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Github className="w-4 h-4" /> Đi tới GitHub.com &rarr;
            </a>
          </div>
          <p>Thiết lập chế độ chạy để chuẩn bị tự động hóa deploy:</p>
          <ol className="list-decimal list-inside space-y-3 ml-1">
            <li>Vào tab <strong>Settings</strong> của repository vừa tạo trên GitHub.</li>
            <li>Nhìn menu bên trái, kéo xuống phần <em>Code and automation</em>, chọn <strong>Pages</strong>.</li>
            <li>Tại mục <strong>Build and deployment</strong>, tìm phần <strong>Source</strong>.</li>
            <li>
              Nhấn vào menu thả xuống và chuyển từ <em>Deploy from a branch</em> sang <strong>GitHub Actions</strong>.
              <div className="mt-3">
                <InteractiveImage src="https://lh3.googleusercontent.com/d/1RZQKimkfCj1w8komsOToQuk0vtlC7Bq6" alt="Cấu hình GitHub Pages" />
              </div>
            </li>
            <li className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-xl list-none mt-2 flex gap-2">
              <span className="text-emerald-600 font-bold">💡 Mẹo cực hay:</span>
              <span className="text-xs leading-relaxed">
                Việc chuyển cấu hình sang <strong>GitHub Actions</strong> tại bước này giúp cho khi bạn tạo file cấu hình ở Bước 4, hệ thống GitHub sẽ có sẵn quyền deploy và chạy thành công ngay lập tức, <strong>hoàn toàn không gặp bất kỳ lỗi đỏ nào!</strong>
              </span>
            </li>
          </ol>
        </div>
      )
    },
    {
      id: 3,
      title: 'Cập nhật Vite Config',
      shortDesc: 'Khai báo đường dẫn base để web không bị lỗi trắng trang.',
      icon: <Code2 className="w-4 h-4" />,
      color: 'amber',
      content: (
        <div className="space-y-4 mt-3 text-sm text-slate-600">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2.5 rounded-xl flex gap-2 shadow-xs">
            <Info className="w-5 h-5 shrink-0 text-amber-600" />
            <p className="text-xs leading-relaxed">
              Nếu bạn không làm bước này, trang web sau khi deploy sẽ bị <strong>trắng tinh</strong> do không tìm thấy file CSS/JS (lỗi 404). Ngoại lệ duy nhất là khi repo của bạn có tên dạng <code>username.github.io</code>.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl space-y-2 shadow-xs">
            <span className="font-bold text-xs uppercase tracking-wider text-blue-700 block">⚠️ Giải thích về "ten-repo-cua-ban" (Rất quan trọng):</span>
            <p className="text-xs leading-relaxed">
              Đường dẫn repository của bạn trên GitHub thường có dạng:<br/>
              <code className="bg-white/80 px-1.5 py-0.5 rounded text-[11px] font-mono break-all inline-block border border-blue-100 text-slate-800 mt-1">https://github.com/ten-user-cua-ban/<strong className="text-pink-600 font-bold">ten-repo-thuc-te</strong></code>
            </p>
            <p className="text-xs leading-relaxed">
              Hãy thay thế chuỗi <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-pink-600 font-bold">ten-repo-cua-ban</code> thành <strong>tên repository thực tế</strong> của bạn (phần được bôi đỏ ở trên).
            </p>
            <p className="text-xs leading-relaxed font-semibold text-blue-900">
              Ví dụ: Nếu tên repository của bạn là <code className="bg-white px-1.5 py-0.5 rounded font-mono text-pink-600 border border-blue-100 font-bold">my-ai-app</code>, cấu hình sẽ là:<br/>
              <code className="bg-slate-900 text-green-400 px-2 py-1 rounded text-[11px] font-mono font-bold inline-block mt-1">base: '/my-ai-app/',</code>
            </p>
          </div>

          <p>Mở file <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs">vite.config.ts</code> trong repo của bạn và thêm thuộc tính <code>base</code> vào bên trong phần <code>return</code> của <code>defineConfig</code> như hướng dẫn bên dưới:</p>
          
          <div className="rounded-lg overflow-hidden border border-slate-200">
            <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 text-xs font-mono text-slate-500 flex items-center gap-2">
              <FileCode2 className="w-3.5 h-3.5" /> vite.config.ts
            </div>
            <pre className="bg-[#0d1117] p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
              <code>
                <span className="text-purple-400">import</span> tailwindcss <span className="text-purple-400">from</span> <span className="text-green-300">'@tailwindcss/vite'</span>;{'\n'}
                <span className="text-purple-400">import</span> react <span className="text-purple-400">from</span> <span className="text-green-300">'@vitejs/plugin-react'</span>;{'\n'}
                <span className="text-purple-400">import</span> path <span className="text-purple-400">from</span> <span className="text-green-300">'path'</span>;{'\n'}
                <span className="text-purple-400">import</span> {'{ defineConfig, loadEnv }'} <span className="text-purple-400">from</span> <span className="text-green-300">'vite'</span>;{'\n\n'}
                <span className="text-purple-400">export default</span> <span className="text-blue-300">defineConfig</span>(({'{ mode }'}) =&gt; {'{'} {'\n'}
                {'  '}<span className="text-purple-400">const</span> env = <span className="text-blue-300">loadEnv</span>(mode, <span className="text-green-300">'.'</span>, <span className="text-green-300">''</span>);{'\n'}
                {'  '}<span className="text-purple-400">return</span> {'{'} {'\n'}
                <div className="bg-amber-500/20 -mx-4 px-4 py-1.5 border-l-2 border-amber-500 my-1">
                  <span className="text-slate-500">{'    '}// 👇 BẮT BUỘC: Thêm dòng base này và thay 'ten-repo-cua-ban' thành repo của bạn</span>{'\n'}
                  {'    '}<span className="text-blue-300">base</span>: <span className="text-green-300">'/ten-repo-cua-ban/'</span>,{'\n'}
                </div>
                {'    '}plugins: [react(), tailwindcss()],{'\n'}
                {'    '}define: {'{'} {'\n'}
                {'      '}<span className="text-green-300">'process.env.GEMINI_API_KEY'</span>: JSON.stringify(env.GEMINI_API_KEY),{'\n'}
                {'    '}{'}'},{'\n'}
                {'    '}// ... giữ nguyên các dòng cấu hình khác bên dưới{'\n'}
                {'  '}{'}'};{'\n'}
                {'}'});
              </code>
            </pre>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'Thêm file Workflow',
      shortDesc: 'Tạo file deploy.yml trong repository của bạn.',
      icon: <FileCode2 className="w-4 h-4" />,
      color: 'blue',
      content: (
        <div className="space-y-3 mt-3 text-sm text-slate-600">
          <p>Để thêm file cấu hình deploy lên repo GitHub, bạn chọn 1 trong 2 cách sau:</p>
          <div className="flex flex-col gap-4">
            
            {/* Cách 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">Cách 1</span>
                <span className="font-semibold text-slate-800 text-sm">Tạo trực tiếp trên GitHub Web (Khuyên dùng)</span>
              </div>
              <ol className="list-decimal list-inside space-y-3 ml-1 text-xs text-slate-600">
                <li>Trong repo của bạn trên GitHub, nhấn nút <strong>Add file</strong> &rarr; <strong>Create new file</strong>.</li>
                <li>Ở ô tên file, gõ chính xác đường dẫn sau: <br/>
                  <code className="bg-pink-50 text-pink-600 px-2 py-1 rounded border border-pink-100 font-mono text-[11px] mt-1 inline-block font-bold">.github/workflows/deploy.yml</code>
                  <div className="mt-2">
                    <InteractiveImage src="https://lh3.googleusercontent.com/d/12Eew2CkRbDccG4jO0W5BSZw9_VvfTe5b" alt="Tạo file mới" />
                  </div>
                </li>
                <li>Copy toàn bộ đoạn code ở khung màu đen bên phải và dán vào nội dung file.</li>
                <li>Nhấn nút <strong>Commit changes...</strong> màu xanh lá cây ở góc phải.
                  <div className="mt-2">
                    <InteractiveImage src="https://lh3.googleusercontent.com/d/1iLomZm1sqFz2r4O0R11B5yrBE4zNL1Uc" alt="Commit file" />
                  </div>
                </li>
              </ol>
            </div>

            {/* Cách 2 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-semibold">Cách 2</span>
                <span className="font-semibold text-slate-800 text-sm">Tải file .yml về và Upload lên GitHub</span>
              </div>
              <ol className="list-decimal list-inside space-y-2 ml-1 text-xs text-slate-600">
                <li>Nhấn nút <strong className="text-blue-600 font-semibold inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"><Download className="w-3 h-3" /> Tải file .yml</strong> ở góc trên bên phải của khung code màu đen bên cạnh.</li>
                <li>
                  Để file chạy đúng cấu trúc, bạn cần đưa file này vào đúng thư mục <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[11px] font-bold">.github/workflows/</code> trên GitHub:
                  <ul className="list-disc list-inside mt-2 ml-4 space-y-1.5 text-slate-500">
                    <li>Nếu bạn đã tạo thư mục này từ trước: Hãy truy cập vào thư mục <code className="font-mono text-[11px]">workflows</code> trên GitHub rồi mới nhấn <strong>Add file</strong> &rarr; <strong>Upload files</strong> và chọn file vừa tải về.</li>
                    <li>Nếu chưa có thư mục: Cách nhanh nhất là kéo thả cả thư mục <code className="font-mono text-[11px] font-bold">.github</code> (chứa thư mục con <code className="font-mono text-[11px] font-bold">workflows</code> và file <code className="font-mono text-[11px] font-bold">deploy.yml</code> bên trong) từ máy tính của bạn vào trang web GitHub.</li>
                  </ul>
                </li>
              </ol>
            </div>

          </div>

          <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-xl space-y-2 shadow-xs mt-4">
            <span className="font-bold text-xs uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              🎉 Deploy thành công ngay lập tức!
            </span>
            <p className="text-xs leading-relaxed">
              Vì bạn đã hoàn thành việc chuyển cấu hình sang <strong>GitHub Actions</strong> tại <strong>Bước 2</strong> từ trước, ngay khi bạn nhấn Commit file <code>deploy.yml</code>, hệ thống sẽ kích hoạt build và deploy thành công hoàn toàn mà <strong>không gặp bất kỳ lỗi đỏ nào!</strong>
            </p>
            <p className="text-xs leading-relaxed">
              Bạn có thể sang tab <strong>Actions</strong> trên kho lưu trữ để xem tiến trình chạy trực quan. Khi các dấu tích chuyển sang màu xanh lá, trang web của bạn đã chính thức hoạt động trực tuyến!
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-slate-900 p-1.5 rounded-lg">
              <Github className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">Deploy 1 web app từ Google AI Studio lên GitHub</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Tự động hóa GitHub Pages
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">Hướng dẫn Quy trình</h2>
            <p className="text-slate-600 text-lg">
              Đẩy web app được build từ Google AI Studio lên GitHub Pages một cách dễ dàng.
            </p>
          </div>
          <div className="shrink-0">
            <a 
              href="https://github.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#24292e] hover:bg-[#1a1e22] text-white font-medium px-5 py-3 rounded-xl shadow-xs hover:shadow-sm transition-all text-sm cursor-pointer"
            >
              <Github className="w-5 h-5" /> Truy cập GitHub &rarr;
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Configuration & Instructions */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Tùy chỉnh cấu hình</h2>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nhánh (Branch)</label>
                  <input 
                    type="text" 
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="main"
                  />
                  <p className="mt-1.5 text-xs text-slate-500">Nhánh sẽ kích hoạt quá trình deploy khi có code mới.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Package Manager</label>
                    <select 
                      value={packageManager}
                      onChange={(e) => setPackageManager(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                    >
                      <option value="npm">npm</option>
                      <option value="yarn">yarn</option>
                      <option value="pnpm">pnpm</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Node.js</label>
                    <select 
                      value={nodeVersion}
                      onChange={(e) => setNodeVersion(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                    >
                      <option value="22">22</option>
                      <option value="24">24 (Khuyên dùng)</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={useLockFile}
                      onChange={(e) => setUseLockFile(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="text-sm">
                      <span className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">Sử dụng file khóa (Lockfile / Cache)</span>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                        Chỉ bật khi repo của bạn có file <code className="font-mono text-[11px] bg-slate-100 px-1 rounded">package-lock.json</code>, <code className="font-mono text-[11px] bg-slate-100 px-1 rounded">yarn.lock</code> hoặc <code className="font-mono text-[11px] bg-slate-100 px-1 rounded">pnpm-lock.yaml</code>.
                      </p>
                      <p className="text-xs text-amber-600 leading-relaxed mt-1 font-medium">
                        ⚠️ Nếu bạn xuất code trực tiếp từ Google AI Studio mà chưa từng cài đặt dependencies ở máy khách (để sinh ra file lock), hãy <strong className="underline">tắt tùy chọn này</strong> để tránh lỗi đỏ như hình bạn thấy.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold">Hướng dẫn các bước</h2>
                </div>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">Nhấn để xem chi tiết</span>
              </div>
              
              <div className="space-y-3">
                {steps.map((step) => (
                  <div 
                    key={step.id} 
                    className={`border rounded-xl overflow-hidden transition-colors ${activeStep === step.id ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <button
                      onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                      className="w-full flex items-center justify-between p-4 text-left bg-white"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                          step.color === 'amber' 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {step.id}
                        </div>
                        <div>
                          <h3 className={`font-semibold text-sm ${activeStep === step.id ? 'text-blue-700' : 'text-slate-900'}`}>
                            {step.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">{step.shortDesc}</p>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${activeStep === step.id ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {activeStep === step.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 border-t border-slate-100 bg-white">
                            {step.content}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Code Preview */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0d1117] rounded-2xl shadow-xl overflow-hidden border border-slate-800 flex flex-col h-full min-h-[600px] sticky top-24"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 bg-[#161b22] border-b border-slate-800 gap-3">
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300 font-mono">.github/workflows/deploy.yml</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleCopy}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-[#21262d] hover:bg-[#30363d] border border-slate-700 rounded-md transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Đã copy!' : 'Copy code'}
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 border border-blue-500 rounded-md transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải file .yml
                  </button>
                </div>
              </div>
              <div className="p-4 overflow-auto flex-1 custom-scrollbar">
                <pre className="text-[13.5px] leading-relaxed font-mono text-slate-300">
                  <code>{yamlContent}</code>
                </pre>
              </div>
            </motion.div>
          </div>

        </div>
      </main>
      
      <AnimatePresence>
        {zoomImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 z-50 flex flex-col items-center justify-center p-4 md:p-8 backdrop-blur-md cursor-zoom-out"
            onClick={() => setZoomImage(null)}
          >
            <motion.button
              className="absolute top-4 right-4 bg-slate-800/80 hover:bg-slate-700 text-white p-2.5 rounded-full transition-colors cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setZoomImage(null);
              }}
            >
              <X className="w-6 h-6" />
            </motion.button>
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-7xl max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={zoomImage}
                alt="Ảnh phóng to"
                className="rounded-2xl shadow-2xl max-w-full max-h-[80vh] object-contain border border-slate-700 cursor-zoom-out"
                onClick={() => setZoomImage(null)}
                referrerPolicy="no-referrer"
              />
              <p className="text-slate-400 text-sm mt-4 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-xs font-medium border border-slate-800 select-none">
                💡 Click vào ảnh hoặc vùng trống bên ngoài để đóng
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0d1117;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #30363d;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #484f58;
        }
      `}} />
    </div>
  );
}

