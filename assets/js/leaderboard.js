        // فتح وإغلاق المودال
        document.getElementById("openModalBtn").addEventListener("click", function () {
            var modal = new bootstrap.Modal(document.getElementById("rankingModal"));
            modal.show();
        });

        async function loadLeaderboard() {
            try {
                const response = await fetch('https://66eef15d3ed5bb4d0bf267fd.mockapi.io/Players');
                const players = await response.json();

                // جلب بيانات المستخدم المسجل من التخزين المحلي
                let currentUserData = localStorage.getItem('player');
                let currentUserId = null;

                if (currentUserData) {
                    currentUserData = JSON.parse(currentUserData); // تحويل النص إلى كائن جافاسكريبت
                    currentUserId = currentUserData.id; // استخراج معرف المستخدم
                }

                // وظيفة لتحويل الوقت من صيغة mm:ss إلى عدد الثواني
                function convertTimeToSeconds(time) {
                    if (!time) return Infinity; // إذا كان الوقت غير موجود، اعتبره غير محدود
                    const [minutes, seconds] = time.split(':').map(Number);
                    return (minutes * 60) + seconds;
                }

                // ترتيب اللاعبين حسب النظام المختلط (الوقت أولاً ثم الخطوات)
                players.sort((a, b) => {
                    const timeA = convertTimeToSeconds(a.score);
                    const timeB = convertTimeToSeconds(b.score);

                    if (timeA === timeB) {
                        return a.level - b.level; // ترتيب حسب الخطوات إذا كان الوقت متساوي
                    }
                    return timeA - timeB; // ترتيب حسب الوقت
                });

                const leaderboardList = document.getElementById('leaderboard-list');
                const statusMessage = document.getElementById('status-message');

                let currentUserRank = null;

                // عرض اللاعبين في القائمة
                players.forEach((player, index) => {
                    let rankClass = '';
                    let rankIcon = '';
                    let rankNumber = index + 1;

                    if (index === 0) {
                        rankClass = 'gold';
                        rankIcon = '🥇'; // المركز الأول
                    } else if (index === 1) {
                        rankClass = 'silver';
                        rankIcon = '🥈'; // المركز الثاني
                    } else if (index === 2) {
                        rankClass = 'bronze';
                        rankIcon = '🥉'; // المركز الثالث
                    }

                    const li = document.createElement('li');
                    li.innerHTML = `
                        <div class="player-info">
                            ${rankNumber > 3 ? `<span class="rank">${rankNumber}</span>` : `<span class="rank ${rankClass}">${rankIcon}</span>`}
                            <img src="${player.avatar}" alt="Avatar" style="margin-left: 5px;">
                            <a href="./settings.html" style=" text-decoration: none; font-weight: bold;"><span>${player.username}</span></a> 
                        </div>
                        <div class="player-stats">
                            <span class="stat-item"> الوقت: ${player.score || 'لم يلعب بعد'} </span> 
                            <span class="stat-item"> الخطوات: ${player.level || 'لم يلعب بعد'} </span>
                        </div>
                    `;
                    // تمييز كرت اللاعب الحالي
                    if (player.id === currentUserId) {
                        li.classList.add('highlighted');
                        currentUserRank = rankNumber;
                    }
                    leaderboardList.appendChild(li);
                });

                if (currentUserRank) {
                    let rankMessage;
                    if (currentUserRank === 1) {
                        rankMessage = 'المركز الأول';
                    } else if (currentUserRank === 2) {
                        rankMessage = 'المركز الثاني';
                    } else if (currentUserRank === 3) {
                        rankMessage = 'المركز الثالث';
                    } else if (currentUserRank === players.length) {
                        rankMessage = 'الأخير';
                    } else {
                        rankMessage = `${currentUserRank} من ${players.length}`;
                    }
                    statusMessage.innerHTML = `<div class="current-rank">مركزك الحالي: ${rankMessage}</div>`;
                } else {
                    statusMessage.innerHTML = `
                        <div class="join-message" style="text-align:center; font-size: 1.2rem; color: #333;">
                            <p style="margin: 0;"> انضم لقائمة المتصدرين 
                                <a href="login.html" style="color: #227B94; text-decoration: underline; font-weight: bold;">سجل الآن</a>
                            </p>
                        </div>
                    `;
                }

            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            }
        }

        window.onload = loadLeaderboard;
        window.onload = function () {
    loadLeaderboard();

    let currentUserData = localStorage.getItem('player');
    let navbarElement = document.getElementById('authButtons');

    // إذا كان المستخدم مسجل دخول
    if (currentUserData) {
        // عرض زر الملف الشخصي
        navbarElement.innerHTML = `
            <a href="settings.html" class="btn btn-light">الملف الشخصي</a>
        `;
    } else {
        // عرض زر التسجيل
        navbarElement.innerHTML = `
            <a href="login.html" class="btn btn-light">تسجيل الدخول</a>
        `;
    }
};
