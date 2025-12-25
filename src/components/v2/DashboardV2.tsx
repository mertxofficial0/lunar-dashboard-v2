import InfoIcon from "../../icons/InfoIcon";
import DashboardHeaderV2 from "./DashboardHeaderV2";
import DashboardGreetingActionsV2 from "./DashboardGreetingActionsV2";


function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardV2() {
  return (
    <div className="flex-1 overflow-y-auto">

   <DashboardHeaderV2 />
   






{/* DASHBOARD CONTENT */}
<div className="bg-[#F5F6F8] p-5">

  <DashboardGreetingActionsV2 greeting={getGreeting()} />



  {/* STATS */}
  <div className="grid grid-cols-5 gap-4 mb-6">
    <Stat
  title={
    <>
      <span>Net P&L</span>
      <div className="relative group w-[15px] h-[15px] flex items-center justify-center cursor-pointer shrink-0">
  {/* ICON */}
  <div className="opacity-50 group-hover:opacity-80">
    <InfoIcon size={15} />
  </div>

  {/* TOOLTIP */}
  <div
  className="
    absolute
    bottom-full
    left-1/2
    -translate-x-5/21
    mb-3
    w-[300px]
    rounded-lg
    bg-white
    px-5 py-2
    text-[12px]
    text-slate-700
    shadow-[0_3px_10px_rgba(15,23,42,0.12)]
    pointer-events-none
    z-50

    opacity-0
    translate-y-1
    transition-all
    duration-200
    ease-out

    group-hover:opacity-100
    group-hover:translate-y-0
    group-hover:delay-[250ms]
  "
>
  
  <div className="flex items-center gap-5">
  {/* LEFT ICON */}
  <div className="shrink-0 flex items-center justify-center">
    <InfoIcon size={20} />
  </div>

  {/* RIGHT TEXT */}
  <div className="leading-snug text-slate-700 font-semibold">
    Seçilen zaman aralığında yaptığın tüm işlemlerin
    toplam kâr ve zarar sonucunu gösterir.
  </div>
</div>

</div>

</div>



    </>
  }
/>

    <Stat
  title={
    <>
      <span>Trade Win %</span>
      <div className="relative group w-[15px] h-[15px] flex items-center justify-center cursor-pointer shrink-0">
  {/* ICON */}
  <div className="opacity-50 group-hover:opacity-80">
    <InfoIcon size={15} />
  </div>

  {/* TOOLTIP */}
  <div
  className="
    absolute
    bottom-full
    left-1/2
    -translate-x-7/21
    mb-3
    w-[300px]
    rounded-lg
    bg-white
    px-5 py-2
    text-[12px]
    text-slate-700
    shadow-[0_3px_10px_rgba(15,23,42,0.12)]
    pointer-events-none
    z-50

    opacity-0
    translate-y-1
    transition-all
    duration-200
    ease-out

    group-hover:opacity-100
    group-hover:translate-y-0
    group-hover:delay-[250ms]
  "
>

  
  <div className="flex items-center gap-5">
  {/* LEFT ICON */}
  <div className="shrink-0 flex items-center justify-center">
    <InfoIcon size={20} />
  </div>

  {/* RIGHT TEXT */}
  <div className="leading-snug text-slate-700 font-semibold">
    Stratejinin başarı oranını gösterir. Yüksek olması, daha fazla işlemin kârla kapandığı anlamına gelir.
  </div>
</div>

</div>

</div>
    </>
  }
/>
    <Stat
  title={
    <>
      <span>Profit Factor</span>
      <div className="relative group w-[15px] h-[15px] flex items-center justify-center cursor-pointer shrink-0">
  {/* ICON */}
  <div className="opacity-50 group-hover:opacity-80">
    <InfoIcon size={15} />
  </div>

  {/* TOOLTIP */}
  <div
  className="
    absolute
    bottom-full
    left-1/2
    -translate-x-7/22
    mb-3
    w-[300px]
    rounded-lg
    bg-white
    px-5 py-2
    text-[12px]
    text-slate-700
    shadow-[0_3px_10px_rgba(15,23,42,0.12)]
    pointer-events-none
    z-50

    opacity-0
    translate-y-1
    transition-all
    duration-200
    ease-out

    group-hover:opacity-100
    group-hover:translate-y-0
    group-hover:delay-[250ms]
  "
>
  
  <div className="flex items-center gap-5">
  {/* LEFT ICON */}
  <div className="shrink-0 flex items-center justify-center">
    <InfoIcon size={20} />
  </div>

  {/* RIGHT TEXT */}
  <div className="leading-snug text-slate-700 font-semibold">
    Kazanan işlemlerden elde edilen toplam kârın, kaybeden işlemlerin toplam zararına oranıdır.
  </div>
</div>

</div>

</div>
    </>
  }
/>
    <Stat
  title={
    <>
      <span>Day Win %</span>
      <div className="relative group w-[15px] h-[15px] flex items-center justify-center cursor-pointer shrink-0">
  {/* ICON */}
  <div className="opacity-50 group-hover:opacity-80">
    <InfoIcon size={15} />
  </div>

  {/* TOOLTIP */}
  <div
  className="
    absolute
    bottom-full
    left-1/2
    -translate-x-6/20
    mb-3
    w-[300px]
    rounded-lg
    bg-white
    px-5 py-2
    text-[12px]
    text-slate-700
    shadow-[0_3px_10px_rgba(15,23,42,0.12)]
    pointer-events-none
    z-50

    opacity-0
    translate-y-1
    transition-all
    duration-200
    ease-out

    group-hover:opacity-100
    group-hover:translate-y-0
    group-hover:delay-[250ms]
  "
>
  
  <div className="flex items-center gap-5">
  {/* LEFT ICON */}
  <div className="shrink-0 flex items-center justify-center">
    <InfoIcon size={20} />
  </div>

  {/* RIGHT TEXT */}
  <div className="leading-snug text-slate-700 font-semibold">
    Seçilen zaman aralığında pozitif sonuçlanan günlerin yüzdesini gösterir.
  </div>
</div>

</div>

</div>
    </>
  }
/>
    <Stat
  title={
    <>
      <span>Avg Win/Loss Trade</span>
      <div className="relative group w-[15px] h-[15px] flex items-center justify-center cursor-pointer shrink-0">
  {/* ICON */}
  <div className="opacity-50 group-hover:opacity-80">
    <InfoIcon size={15} />
  </div>

  {/* TOOLTIP */}
  <div
  className="
    absolute
    bottom-full
    left-1/2
    -translate-x-7/15
    mb-3
    w-[300px]
    rounded-lg
    bg-white
    px-5 py-2
    text-[12px]
    text-slate-700
    shadow-[0_3px_10px_rgba(15,23,42,0.12)]
    pointer-events-none
    z-50

    opacity-0
    translate-y-1
    transition-all
    duration-200
    ease-out

    group-hover:opacity-100
    group-hover:translate-y-0
    group-hover:delay-[250ms]
  "
>
  
  <div className="flex items-center gap-5">
  {/* LEFT ICON */}
  <div className="shrink-0 flex items-center justify-center">
    <InfoIcon size={20} />
  </div>

  {/* RIGHT TEXT */}
  <div className="leading-snug text-slate-700 font-semibold">
    Tüm tradelerin ortalama kazanç ile ortalama zarar arasındaki oranı gösterir.
  </div>
</div>

</div>

</div>
    </>
  }
/>
  </div>


  {/* GRID */}
  <div className="grid grid-cols-12 gap-4">
  <div className="col-span-4">
    <Card
  title={
    <div className="flex items-center gap-2">
      <span>Lunar Score</span>

      <div className="relative group w-[17px] h-[17px] flex items-center justify-center cursor-pointer shrink-0">
  {/* ICON */}
  <div className="opacity-50 group-hover:opacity-80">
    <InfoIcon size={17} />
  </div>

  {/* TOOLTIP */}
  <div
  className="
    absolute
    left-full
    top-1/2
    -translate-y-1/2
    ml-3
    w-[300px]
    rounded-lg
    bg-white
    px-5 py-2
    text-[12px]
    text-slate-700
    shadow-[0_3px_10px_rgba(15,23,42,0.12)]
    pointer-events-none
    z-50

    opacity-0
    translate-x-1
    transition-all
    duration-200
    ease-out

    group-hover:opacity-100
    group-hover:translate-x-0
    group-hover:delay-[250ms]
  "
>

  
  <div className="flex items-center gap-5">
  {/* LEFT ICON */}
  <div className="shrink-0 flex items-center justify-center">
    <InfoIcon size={20} />
  </div>

  {/* RIGHT TEXT */}
  <div className="leading-snug text-slate-700">
    Kazanma oranı, risk–ödül dengesi ve tutarlılığı bir araya getirerek genel performansını ölçer.
  </div>
</div>

</div>

</div>


    </div>
  }
  height="h-[300px]"
>

      Radar chart
    </Card>
  </div>

  <div className="col-span-4">
    <Card
  title={
    <div className="flex items-center gap-2">
      <span>Daily Net Cumulative P&L</span>
      <div className="relative group w-[17px] h-[17px] flex items-center justify-center cursor-pointer shrink-0">
  {/* ICON */}
  <div className="opacity-50 group-hover:opacity-80">
    <InfoIcon size={17} />
  </div>

  {/* TOOLTIP */}
  <div
  className="
    absolute
    left-full
    top-1/2
    -translate-y-1/2
    ml-3
    w-[300px]
    rounded-lg
    bg-white
    px-5 py-2
    text-[12px]
    text-slate-700
    shadow-[0_3px_10px_rgba(15,23,42,0.12)]
    pointer-events-none
    z-50

    opacity-0
    translate-x-1
    transition-all
    duration-200
    ease-out

    group-hover:opacity-100
    group-hover:translate-x-0
    group-hover:delay-[250ms]
  "
>

  
  <div className="flex items-center gap-5">
  {/* LEFT ICON */}
  <div className="shrink-0 flex items-center justify-center">
    <InfoIcon size={20} />
  </div>

  {/* RIGHT TEXT */}
  <div className="leading-snug text-slate-700">
    Her günün net sonucunun önceki günlere eklenmesiyle oluşan toplam performansı ifade eder.
  </div>
</div>

</div>

</div>
    </div>
  }
  height="h-[300px]"
>

      Area chart
    </Card>
  </div>

  <div className="col-span-4">
    <Card
  title={
    <div className="flex items-center gap-2">
      <span>Net Daily P&L</span>
      <div className="relative group w-[17px] h-[17px] flex items-center justify-center cursor-pointer shrink-0">
  {/* ICON */}
  <div className="opacity-50 group-hover:opacity-80">
    <InfoIcon size={17} />
  </div>

  {/* TOOLTIP */}
  <div
  className="
    absolute
    left-full
    top-1/2
    -translate-y-1/2
    ml-3
    w-[300px]
    rounded-lg
    bg-white
    px-5 py-2
    text-[12px]
    text-slate-700
    shadow-[0_3px_10px_rgba(15,23,42,0.12)]

    pointer-events-none
    z-50

    opacity-0
    translate-x-1
    transition-all
    duration-200
    ease-out

    group-hover:opacity-100
    group-hover:translate-x-0
    group-hover:delay-[250ms]
  "
>

  
  <div className="flex items-center gap-5">
  {/* LEFT ICON */}
  <div className="shrink-0 flex items-center justify-center">
    <InfoIcon size={20} />
  </div>

  {/* RIGHT TEXT */}
  <div className="leading-snug text-slate-700">
    Günlük bazda elde edilen toplam kazanç ve kayıpların net sonucunu ifade eder.
  </div>
</div>

</div>

</div>

    </div>
  }
  height="h-[300px]"
>
      Bar chart
    </Card>
  </div>
</div>

{/* LOWER GRID */}
<div className="grid grid-cols-12 gap-4 mt-4">
  {/* LEFT COLUMN */}
  <div className="col-span-4 space-y-4">
    <Card title="Recent Trades" height="h-[400px]">
      Recent trades table
    </Card>

    <Card title="Account Balance" height="h-[180px]">
      Balance chart / number
    </Card>
  </div>

  {/* RIGHT COLUMN */}
  <div className="col-span-8">
    <Card title="Calendar" height="h-[600px]">
      Calendar view
    </Card>
  </div>
</div>



</div>


      
      
        
      
    </div>
  );
}

/* UI */
function Card({
  title,
  children,
  height = "h-[240px]",
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  height?: string;
}) {

  return (
    <div className="
      bg-white
      rounded-xl
      p-5
      shadow-[0_1px_1px_rgba(0,0,0,0.03)]
    ">
      {/* TITLE */}
      <div className="text-sm font-semibold text-slate-700 -mt-1.5
 ">
        {title}
      </div>

      {/* FULL-WIDTH DIVIDER */}
      <div className="-mx-5 mt-3 mb-4 h-px bg-slate-200" />

      {/* CONTENT */}
      <div
        className={`flex items-center justify-center text-slate-400 text-sm ${height}`}
      >
        {children}
      </div>
    </div>
  );
}



function Stat({ title }: { title: React.ReactNode }) {

  return (
    <div className="
  bg-white
  rounded-xl
  p-5
  min-h-[100px]
  shadow-[0_1px_1px_rgba(0,0,0,0.03)]
">





      <div className="flex items-centerfont-semibold gap-1.5 text-xs text-slate-500 mb-1">
  {title}
</div>

      <div className="text-xl font-semibold text-slate-900">
        —
      </div>
    </div>
  );
}
