import React, { useState } from 'react';
import { Copy, Download, Check, Github, Settings, Terminal, FileCode2, ChevronDown, FolderGit2, Globe, Code2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [branch, setBranch] = useState('main');
  const [nodeVersion, setNodeVersion] = useState('20');
  const [packageManager, setPackageManager] = useState('npm');
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(1);

  const getInstallCommand = () => {
    switch (packageManager) {
      case 'yarn': return 'yarn install --frozen-lockfile';
      case 'pnpm': return 'pnpm install --frozen-lockfile';
      default: return 'npm ci';
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
          node-version: ${nodeVersion}
          cache: '${packageManager}'
          
      - name: Install dependencies
        run: ${getInstallCommand()}
        
      - name: Build project
        run: ${getBuildCommand()}
        
      - name: Setup GitHub Pages
        uses: actions/configure-pages@v4
        
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

  const viteConfigExample = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 👇 BẮT BUỘC: Thêm dòng này để sửa lỗi trắng trang (404)
  // Thay 'ten-repo-cua-ban' bằng tên repository thực tế trên GitHub
  base: '/ten-repo-cua-ban/', 
})`;

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
              <div className="flex flex-col gap-2">
                <span className="leading-relaxed">Nhấn menu <strong>Settings</strong> (biểu tượng ⚙️ góc phải trên cùng) &rarr; Chọn <strong>GitHub</strong> và làm theo hình. Cách này thuận tiện hơn.</span>
                <img src="https://lh3.googleusercontent.com/d/1uQS1uKV9XKCUCp5pqIKamCRXELWQUlg6" alt="Hướng dẫn Export GitHub" className="rounded-md border border-slate-600 w-full max-w-md mt-1" referrerPolicy="no-referrer" />
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
      title: 'Thêm file Workflow',
      shortDesc: 'Tạo file deploy.yml trong repository của bạn.',
      icon: <FileCode2 className="w-4 h-4" />,
      color: 'blue',
      content: (
        <div className="space-y-3 mt-3 text-sm text-slate-600">
          <p>Truy cập vào repository của bạn trên GitHub và làm theo các bước:</p>
          <ol className="list-decimal list-inside space-y-2 ml-1">
            <li>Nhấn nút <strong>Add file</strong> &rarr; <strong>Create new file</strong>.</li>
            <li>Ở ô tên file, gõ chính xác đường dẫn sau: <br/>
              <code className="bg-pink-50 text-pink-600 px-2 py-1 rounded border border-pink-100 font-mono text-xs mt-1 inline-block">.github/workflows/deploy.yml</code>
              <div className="mt-2 mb-4 pl-5">
                <img src="https://lh3.googleusercontent.com/d/12Eew2CkRbDccG4jO0W5BSZw9_VvfTe5b" alt="Tạo file mới" className="rounded-md border border-slate-200 w-full max-w-md shadow-sm" referrerPolicy="no-referrer" />
              </div>
            </li>
            <li>Copy toàn bộ đoạn code ở khung màu đen bên phải và dán vào nội dung file.</li>
            <li>Nhấn nút <strong>Commit changes...</strong> màu xanh lá cây ở góc phải.
              <div className="mt-2 pl-5">
                <img src="https://lh3.googleusercontent.com/d/1iLomZm1sqFz2r4O0R11B5yrBE4zNL1Uc" alt="Commit file" className="rounded-md border border-slate-200 w-full max-w-md shadow-sm" referrerPolicy="no-referrer" />
              </div>
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
        <div className="space-y-3 mt-3 text-sm text-slate-600">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2 rounded-md flex gap-2">
            <Info className="w-5 h-5 shrink-0 text-amber-600" />
            <p className="text-xs leading-relaxed">
              Nếu bạn không làm bước này, trang web sau khi deploy sẽ bị <strong>trắng tinh</strong> do không tìm thấy file CSS/JS (lỗi 404). Ngoại lệ duy nhất là khi repo của bạn có tên dạng <code>username.github.io</code>.
            </p>
          </div>
          <p>Mở file <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs">vite.config.ts</code> trong repo của bạn và thêm thuộc tính <code>base</code> vào bên trong <code>defineConfig</code> như hình dưới:</p>
          
          <div className="rounded-lg overflow-hidden border border-slate-200">
            <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 text-xs font-mono text-slate-500 flex items-center gap-2">
              <FileCode2 className="w-3.5 h-3.5" /> vite.config.ts
            </div>
            <pre className="bg-[#0d1117] p-4 text-xs font-mono text-slate-300 overflow-x-auto">
              <code>
                <span className="text-purple-400">import</span> {'{ defineConfig }'} <span className="text-purple-400">from</span> <span className="text-green-300">'vite'</span>{'\n'}
                <span className="text-purple-400">import</span> react <span className="text-purple-400">from</span> <span className="text-green-300">'@vitejs/plugin-react'</span>{'\n\n'}
                <span className="text-purple-400">export default</span> <span className="text-blue-300">defineConfig</span>({'{'}{'\n'}
                {'  '}plugins: [react()],{'\n'}
                <div className="bg-amber-500/20 -mx-4 px-4 py-1 border-l-2 border-amber-500">
                  <span className="text-slate-500">{'  '}// 👇 BẮT BUỘC: Thêm dòng này</span>{'\n'}
                  {'  '}<span className="text-blue-300">base</span>: <span className="text-green-300">'/ten-repo-cua-ban/'</span>,{'\n'}
                </div>
                {'}'})
              </code>
            </pre>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'Cấu hình GitHub Pages',
      shortDesc: 'Bật tính năng deploy bằng GitHub Actions.',
      icon: <Globe className="w-4 h-4" />,
      color: 'blue',
      content: (
        <div className="space-y-3 mt-3 text-sm text-slate-600">
          <p>Bước cuối cùng để GitHub biết cách chạy file workflow của bạn:</p>
          <ol className="list-decimal list-inside space-y-3 ml-1">
            <li>Vào tab <strong>Settings</strong> của repository.</li>
            <li>Nhìn menu bên trái, kéo xuống phần <em>Code and automation</em>, chọn <strong>Pages</strong>.</li>
            <li>Tại mục <strong>Build and deployment</strong>, tìm phần <strong>Source</strong>.</li>
            <li>
              Nhấn vào menu thả xuống và chuyển từ <em>Deploy from a branch</em> sang <strong>GitHub Actions</strong>.
              <div className="mt-3">
                <img src="https://lh3.googleusercontent.com/d/1RZQKimkfCj1w8komsOToQuk0vtlC7Bq6" alt="Cấu hình GitHub Pages" className="rounded-md border border-slate-200 w-full max-w-md shadow-sm" referrerPolicy="no-referrer" />
              </div>
            </li>
            <li>Xong! Bây giờ mỗi khi bạn push code lên nhánh <code>{branch}</code>, web sẽ tự động được deploy. Bạn có thể xem tiến trình ở tab <strong>Actions</strong>.</li>
          </ol>
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
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">Hướng dẫn Quy trình</h2>
          <p className="text-slate-600 text-lg">
            Đẩy web app được build từ Google AI Studio lên GitHub Pages một cách dễ dàng.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Configuration & Instructions */}
          <div className="lg:col-span-5 space-y-6">
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
                      <option value="18">18</option>
                      <option value="20">20</option>
                      <option value="22">22</option>
                    </select>
                  </div>
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
          <div className="lg:col-span-7">
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

