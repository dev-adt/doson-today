/* BizHub — Global Search */
const SEARCH_DATA = [
  {type:'member',title:'Công ty CP Vina Tech',sub:'Công nghệ thông tin · Platinum',url:'members.html'},
  {type:'member',title:'Hoàng Long Export',sub:'Xuất nhập khẩu · Gold',url:'members.html'},
  {type:'member',title:'BĐS Phú Thịnh',sub:'Bất động sản · Silver',url:'members.html'},
  {type:'member',title:'Dược phẩm Sao Mai',sub:'Y tế & Sức khỏe · Platinum',url:'members.html'},
  {type:'member',title:'Giáo dục Ánh Dương',sub:'Giáo dục & Đào tạo · Gold',url:'members.html'},
  {type:'member',title:'Fintech VN Partners',sub:'Dịch vụ tài chính · Gold',url:'members.html'},
  {type:'post',title:'Tìm đối tác triển khai ERP miền Trung',sub:'Vina Tech · Tìm kiếm đối tác',url:'posts.html'},
  {type:'post',title:'Cần nhà cung cấp gạo ST25 số lượng lớn',sub:'Hoàng Long · Cần mua',url:'posts.html'},
  {type:'post',title:'Hội thảo dược phẩm Q3 2025',sub:'Sao Mai · Sự kiện',url:'posts.html'},
  {type:'event',title:'Hội nghị xuất khẩu ASEAN 2025',sub:'15/07/2025 · Hà Nội',url:'index.html'},
  {type:'event',title:'Vietnam Tech Expo 2025',sub:'22/07/2025 · TP. HCM',url:'index.html'},
];

const TYPE_ICON={member:'ti-users',post:'ti-news',event:'ti-calendar-event'};
const TYPE_LABEL={member:'Hội viên',post:'Bài viết',event:'Sự kiện'};

function highlight(text,q){
  if(!q) return text;
  const i=text.toLowerCase().indexOf(q.toLowerCase());
  if(i<0) return text;
  return text.slice(0,i)+`<mark style="background:#FAEEDA;border-radius:2px;padding:0 1px">${text.slice(i,i+q.length)}</mark>`+text.slice(i+q.length);
}

function renderSearch(q, dropId){
  const drop=document.getElementById(dropId);
  if(!drop) return;
  if(!q||q.length<1){ drop.classList.remove('open'); return; }
  const hits=SEARCH_DATA.filter(r=>r.title.toLowerCase().includes(q.toLowerCase())||r.sub.toLowerCase().includes(q.toLowerCase())).slice(0,6);
  if(!hits.length){
    drop.innerHTML=`<div class="sd-empty">Không tìm thấy kết quả</div>`;
  } else {
    const grouped={};
    hits.forEach(h=>{ if(!grouped[h.type]) grouped[h.type]=[]; grouped[h.type].push(h); });
    drop.innerHTML=Object.entries(grouped).map(([type,items])=>
      `<div class="sd-header">${TYPE_LABEL[type]||type}</div>`+
      items.map(r=>`<div class="sd-item" onclick="location.href='${r.url}'">
        <i class="ti ${TYPE_ICON[r.type]||'ti-search'}" style="font-size:14px;color:#185FA5"></i>
        <div><div class="sd-title">${highlight(r.title,q)}</div><div class="sd-sub">${r.sub}</div></div>
      </div>`).join('')
    ).join('');
  }
  drop.classList.add('open');
}

document.addEventListener('DOMContentLoaded',()=>{
  const sbSearch=document.getElementById('sb-search');
  const mainSearch=document.getElementById('main-search');
  if(sbSearch){
    sbSearch.addEventListener('input',e=>renderSearch(e.target.value,'sb-results'));
    sbSearch.addEventListener('blur',()=>setTimeout(()=>document.getElementById('sb-results')?.classList.remove('open'),200));
    sbSearch.addEventListener('focus',e=>renderSearch(e.target.value,'sb-results'));
  }
  if(mainSearch){
    mainSearch.addEventListener('input',e=>renderSearch(e.target.value,'main-results'));
    mainSearch.addEventListener('blur',()=>setTimeout(()=>document.getElementById('main-results')?.classList.remove('open'),200));
    mainSearch.addEventListener('focus',e=>renderSearch(e.target.value,'main-results'));
  }
});
