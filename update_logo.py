import re

for filename in ['src/components/landing/LandingPage.tsx', 'src/app/about/page.tsx']:
    with open(filename, 'r') as f:
        content = f.read()

    # We need to make sure Next/Image is imported.
    if 'import Image from "next/image";' not in content and 'import Image from \'next/image\';' not in content:
        content = content.replace("import {", 'import Image from "next/image";\nimport {', 1)

    # In LandingPage.tsx, we have a click handler: onClick={onGetStarted}
    if 'LandingPage.tsx' in filename:
        new_logo = """const LWHHLogo = () => (
    <div className="flex items-center gap-3 cursor-pointer" onClick={onGetStarted}>
      <Image src="/somporko.webp" alt="Shomporko CRM Logo" width={40} height={40} className="object-contain" />
      <span className="font-display font-black text-2xl tracking-tighter text-black">
        SHOMPORKO
      </span>
    </div>
  );"""
        
        # Regex to replace the LWHHLogo component block
        content = re.sub(
            r'const LWHHLogo = \(\) => \(\s*<div className="flex items-center gap-3 cursor-pointer" onClick=\{onGetStarted\}>.*?</div>\s*\);\s*',
            new_logo + '\n\n  ',
            content,
            flags=re.DOTALL
        )
    else:
        new_logo = """const LWHHLogo = () => (
  <Link href="/" className="flex items-center gap-3 cursor-pointer">
    <Image src="/somporko.webp" alt="Shomporko CRM Logo" width={40} height={40} className="object-contain" />
    <span className="font-display font-black text-2xl tracking-tighter text-black">
      SHOMPORKO
    </span>
  </Link>
);"""
        
        content = re.sub(
            r'const LWHHLogo = \(\) => \(\s*<Link href="/" className="flex items-center gap-3 cursor-pointer">.*?</Link>\s*\);',
            new_logo,
            content,
            flags=re.DOTALL
        )

    with open(filename, 'w') as f:
        f.write(content)
