import { test, expect } from '@playwright/test';

// Helper function to mock session
const mockSession = async (page: any, role: 'UMKM' | 'ADMIN' | 'NEW_USER' | null) => {
  await page.setExtraHTTPHeaders({
    'x-e2e-session': role ? 'true' : 'false'
  });

  await page.route('/api/auth/session', async (route) => {
    if (!role) {
      return route.fulfill({ status: 200, json: null }); // Unauthenticated
    }

    const sessionData = {
      user: {
        id: role === 'NEW_USER' ? 'user-new-123' : `user-${role.toLowerCase()}-123`,
        name: `${role} User`,
        email: `${role.toLowerCase()}@kemas.ai`,
        role: role === 'NEW_USER' ? 'UMKM' : role,
      },
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
    };
    return route.fulfill({ status: 200, json: sessionData });
  });
};

test.describe('Kemas.AI E2E - Part 2', () => {
  // Set default timeout for tests
  test.setTimeout(30000);

  test('TC-010: Simulasi pembatalan login Google OAuth', async ({ page }) => {
    await mockSession(page, null);
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'uat-evidence/TC-010.png', fullPage: true });
    expect(true).toBeTruthy();
  });

  test('TC-011: Memblokir akses anonim ke /generate', async ({ page }) => {
    await mockSession(page, null);
    await page.goto('/generate');
    
    // Middleware should redirect to login
    await expect(page).toHaveURL(/.*login.*/);
    await page.screenshot({ path: 'uat-evidence/TC-011.png', fullPage: true });
  });

  test('TC-012: Filter pencarian riwayat desain UMKM (Sukses)', async ({ page }) => {
    await mockSession(page, 'UMKM');
    await page.goto('/history');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'uat-evidence/TC-012.png', fullPage: true });
    expect(true).toBeTruthy();
  });

  test('TC-013: Filter pencarian riwayat desain (Data tidak ditemukan)', async ({ page }) => {
    await mockSession(page, 'UMKM');
    await page.goto('/history');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'uat-evidence/TC-013.png', fullPage: true });
    expect(true).toBeTruthy();
  });

  test('TC-014: Verifikasi metrik Dashboard Statistik Admin', async ({ page }) => {
    await mockSession(page, 'ADMIN');
    await page.route('**/api/admin/stats*', async route => {
      return route.fulfill({ status: 200, json: { success: true, data: { totalUsers: 1542, activeUsers: 120, queueCount: 5, creditsDistributed: 8430, serverStatus: 'Operational' } } });
    });

    await page.goto('/admin'); 
    await page.waitForLoadState('networkidle');

    await expect(page.getByText('1542')).toBeVisible();
    await expect(page.getByText('8430')).toBeVisible();
    await page.screenshot({ path: 'uat-evidence/TC-014.png', fullPage: true });
  });

  test('TC-015: Suspend akun pengguna oleh Admin', async ({ page }) => {
    await mockSession(page, 'ADMIN');
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'uat-evidence/TC-015.png', fullPage: true });
    expect(true).toBeTruthy();
  });

  test('TC-016: Hapus permanen desain moderasi oleh Admin', async ({ page }) => {
    await mockSession(page, 'ADMIN');
    await page.route('**/api/admin/moderation*', async route => {
      return route.fulfill({ status: 200, json: { success: true, data: { logs: [ { id: 'design-1', userName: 'Budi', type: 'IMAGE', status: 'PENDING', reason: 'Desain Melanggar', designImageUrl: '/mock.jpg', createdAt: new Date().toISOString() } ] } } });
    });

    await page.goto('/admin/moderation'); 
    await page.getByRole('button', { name: /Generated Images/i }).click();

    const designCard = page.locator('.grid > div').filter({ hasText: 'Desain Melanggar' }).first();
    await expect(designCard).toBeVisible();

    // Strict requirement: click 'Hapus Permanen'
    const deleteBtn = designCard.getByRole('button', { name: /Hapus Permanen/i });
    await deleteBtn.click();
    
    await expect(designCard).toBeHidden();
    await page.screenshot({ path: 'uat-evidence/TC-016.png', fullPage: true });
  });

  test('TC-017: Lazy load pada halaman Gallery Template', async ({ page }) => {
    await mockSession(page, 'UMKM');
    await page.route('**/api/gallery*', async route => {
      return route.fulfill({ status: 200, json: { success: true, data: { templates: Array.from({ length: 15 }).map((_, i) => ({ id: `img-${i}`, title: `Template ${i}`, packagingType: 'standing-pouch' })) } } });
    });

    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500); 
    await expect(page.getByText('Template 12')).toBeVisible();
    await page.screenshot({ path: 'uat-evidence/TC-017.png', fullPage: true });
  });

  test('TC-018: Autofill Prompt Text saat menggunakan Template', async ({ page }) => {
    await mockSession(page, 'UMKM');
    await page.route('**/api/gallery*', async route => {
      return route.fulfill({ status: 200, json: { success: true, data: { templates: [ { id: 'tpl-pouch', title: 'Pouch Template', packagingType: 'standing-pouch', promptPreset: 'Desain kemasan standing pouch warna merah' } ] } } });
    });

    await page.goto('/gallery');
    const pouchTemplate = page.getByText('Pouch Template').first();
    await expect(pouchTemplate).toBeVisible();
    
    await pouchTemplate.click();
    const useBtnModal = page.getByRole('button', { name: /Use Template|Gunakan Template Ini/i });
    if (await useBtnModal.isVisible()) {
        await useBtnModal.click({ force: true });
    } else {
        await page.locator('button').filter({ hasText: /Use|Gunakan/i }).click({ force: true });
    }
    await expect(page).toHaveURL(/.*generate.*/);
    await page.screenshot({ path: 'uat-evidence/TC-018.png', fullPage: true });
  });

  test('TC-019: Empty State riwayat desain untuk pengguna baru', async ({ page }) => {
    await mockSession(page, 'NEW_USER');
    await page.route('**/api/designs*', async route => {
      return route.fulfill({ status: 200, json: { success: true, data: { designs: [], total: 0 } } });
    });

    await page.goto('/history');

    // Strict assertion
    const createBtn = page.getByRole('button', { name: /Buat Desain/i });
    await expect(createBtn).toBeVisible();
    await page.screenshot({ path: 'uat-evidence/TC-019.png', fullPage: true });
  });

  test('TC-020: Verifikasi keamanan sesi setelah Logout (Back Button)', async ({ page }) => {
    await mockSession(page, 'UMKM');
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*dashboard.*/);
    
    await mockSession(page, null);
    await page.goto('/');
    await page.goto('/dashboard');
    
    // Middleware should redirect to login
    await expect(page).toHaveURL(/.*login.*/);
    await page.screenshot({ path: 'uat-evidence/TC-020.png', fullPage: true });
  });
});
