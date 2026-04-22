import type { JSX } from 'react';

interface Feature {
  text: string;
  positive: boolean;
}

interface Option {
  id: string;
  name: string;
  price: string;
  priceNote: string;
  features: Feature[];
  highlighted: boolean;
}

function buildOptions(locale: string): Option[] {
  const ja = locale === 'ja';
  return [
    {
      id: 'diy',
      name: ja ? 'ペライチ / STUDIO' : 'DIY Tools',
      price: ja ? '月¥1,465〜' : '¥1,465/mo+',
      priceNote: ja ? '＋自分の時間' : '+ your time',
      features: [
        { text: ja ? '自分でデザイン・作成' : 'You design and build it yourself', positive: false },
        { text: ja ? '更新も自分で管理' : 'You manage all updates', positive: false },
        { text: ja ? 'テンプレートベース' : 'Template-based design', positive: false },
        { text: ja ? 'サポートなし' : 'No support included', positive: false },
      ],
      highlighted: false,
    },
    {
      id: 'freelancer',
      name: ja ? 'フリーランス' : 'Freelancer',
      price: ja ? '¥50,000〜' : '¥50k+',
      priceNote: ja ? '前払い・1回限り' : 'upfront, one-off',
      features: [
        { text: ja ? '制作は依頼できる' : 'They build it for you', positive: true },
        { text: ja ? '更新は都度費用' : 'Every update costs extra', positive: false },
        { text: ja ? 'モバイル対応は保証なし' : 'Mobile quality not guaranteed', positive: false },
        { text: ja ? '納品後に音信不通リスク' : 'Risk of going dark post-delivery', positive: false },
      ],
      highlighted: false,
    },
    {
      id: 'zeroen',
      name: 'ZeroEn',
      price: ja ? '月¥10,000〜' : '¥10,000/mo+',
      priceNote: ja ? '前金¥0' : '¥0 upfront',
      features: [
        { text: ja ? '制作はすべておまかせ' : 'We build everything for you', positive: true },
        { text: ja ? '毎月の更新が月額に含まれる' : 'Monthly updates included', positive: true },
        { text: ja ? 'モバイルファースト設計' : 'Mobile-first by default', positive: true },
        { text: ja ? '毎月継続してサポート' : 'Ongoing monthly support', positive: true },
      ],
      highlighted: true,
    },
  ];
}

interface Props {
  locale: string;
}

export function ComparisonTable({ locale }: Props): JSX.Element {
  const options = buildOptions(locale);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {options.map((option) => (
        <div
          key={option.id}
          className={`flex flex-col rounded-lg p-6 ${
            option.highlighted
              ? 'bg-[#111827] border-2 border-[#00E87A] shadow-[0_0_32px_rgba(0,232,122,0.12)]'
              : 'bg-[#0A0A0A] border border-[#1F2937] opacity-75'
          }`}
        >
          <p
            className={`font-mono text-xs uppercase tracking-widest mb-1 ${
              option.highlighted ? 'text-[#00E87A]' : 'text-[#4B5563]'
            }`}
          >
            {option.name}
          </p>
          <p
            className={`font-heading font-bold text-2xl mb-0.5 ${
              option.highlighted ? 'text-[#F4F4F2]' : 'text-[#6B7280]'
            }`}
          >
            {option.price}
          </p>
          <p className="font-mono text-xs text-[#4B5563] mb-5">{option.priceNote}</p>
          <ul className="space-y-3 flex-1">
            {option.features.map((feat) => (
              <li key={feat.text} className="flex items-start gap-2">
                <span
                  className={`font-mono text-xs font-bold flex-shrink-0 mt-0.5 ${
                    feat.positive ? 'text-[#00E87A]' : 'text-[#374151]'
                  }`}
                >
                  {feat.positive ? '✓' : '✗'}
                </span>
                <span
                  className={`font-mono text-xs leading-relaxed ${
                    option.highlighted ? 'text-[#9CA3AF]' : 'text-[#4B5563]'
                  }`}
                >
                  {feat.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
