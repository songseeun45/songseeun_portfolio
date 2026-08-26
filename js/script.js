document.querySelectorAll('a[href="#home"]').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});


// mobile nav
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('mobile-menu-btn'); // 햄버거 버튼
    const mobileCloseBtn = document.getElementById('mobile-close-btn'); // 직접 만든 닫기 버튼
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

    // 메뉴 열기 (햄버거 버튼 클릭 시)
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // 메뉴 닫기 (X 버튼 클릭 시)
    if (mobileCloseBtn && mobileNav) {
        mobileCloseBtn.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // 메뉴 링크 클릭 시 메뉴 닫기
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
});

// 섹션 감지해서 nav active 처리
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav a, .contact-btn a");

window.addEventListener("scroll", () => {
    let current = "";

    const scrollTop = window.scrollY;
    const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;

    // ⭐ contact (맨 아래)
    if (scrollBottom) {
        current = "contact";
    } 
    // ⭐ 나머지 섹션
    else {
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (scrollTop >= sectionTop &&
                scrollTop < sectionTop + sectionHeight) {
                current = section.getAttribute("id");
            }
        });
    }

    navLinks.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
});


// CountUp 실행
const counters = document.querySelectorAll('.stat strong');

const runCount = () => {
    counters.forEach(el => {
        const target = +el.getAttribute('data-target');

        const counter = new countUp.CountUp(el, target, {
            duration: 2,
            suffix: '%'
        });

        if (!counter.error) {
            counter.start();
        }
    });
};

// 스크롤 트리거
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            runCount();
            observer.disconnect();
        }
    });
});

observer.observe(document.querySelector('.stats'));


// Swiper 초기화
new Swiper('.shortsSwiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    pagination: { el: '.shortsSwiper .swiper-pagination', clickable: true },
    breakpoints: {
        640: { slidesPerView: 2.2, spaceBetween: 30 },
        1024: { slidesPerView: 3.5, spaceBetween: 40 },
        1600: { slidesPerView: 4.8, spaceBetween: 50 }
    }
});

new Swiper('.videoSwiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    pagination: { el: '.videoSwiper .swiper-pagination', clickable: true },
    breakpoints: {
        768: { slidesPerView: 1.5, spaceBetween: 50 },
        1200: { slidesPerView: 2, spaceBetween: 60 }
    }
});


// 모달 기능
// 비디오 주소 처리 로직
const modal = document.getElementById('videoModal');
const container = document.getElementById('modalContainer');
const playerArea = document.getElementById('videoPlayerArea');

// 복잡한 유튜브 주소에서도 ID만 뽑아내는 개선된 정규식
function getYoutubeId(url) {
    try {
        const urlObj = new URL(url);

        let id = null;

        if (urlObj.searchParams.get("v")) {
            id = urlObj.searchParams.get("v");
        } else if (urlObj.hostname.includes("youtu.be")) {
            id = urlObj.pathname.slice(1);
        } else if (urlObj.pathname.includes("/embed/")) {
            id = urlObj.pathname.split("/embed/")[1];
        }

        // 핵심: 뒤에 붙은 파라미터 제거
        return id ? id.split('&')[0] : null;

    } catch {
        return null;
    }
}

document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', function () {
        const url = this.getAttribute('data-video-url');
        const type = this.getAttribute('data-video-type');
        const youtubeId = getYoutubeId(url);

        if (type === 'vertical') container.classList.add('vertical');
        else container.classList.remove('vertical');

        if (youtubeId) {
            playerArea.innerHTML = `<iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        } else {
            playerArea.innerHTML = `<video src="${url}" controls autoplay></video>`;
        }

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
});

function closeModal() {
    modal.classList.remove('show');
    playerArea.innerHTML = "";
    document.body.style.overflow = 'auto';
}

modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });