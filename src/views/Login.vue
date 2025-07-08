<template>
  <transition name="fade-slide">
    <div class="login-container">
      <div class="login-card">
        <h1 class="title"><span class="green">Jep</span>Track</h1>
        <p class="subtitle">Infinity Cinema Employee System</p>

        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" placeholder="admin@jeptrack.com" />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" placeholder="••••••••" />
        </div>

        <button class="login-btn" @click="handleLogin">Login</button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

const handleLogin = () => {
  if (email.value === 'admin@jeptrack.com' && password.value === 'admin123') {
    localStorage.setItem('loggedIn', 'true')
    alert('Selamat datang, Admin!')
    router.push('/dashboard')
  } else {
    alert('Email atau password salah!')
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%);
  padding: 1rem;
}

.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: all 0.3s ease;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.green {
  color: #4ade80;
}

.subtitle {
  font-size: 0.95rem;
  color: #64748b;
  margin-bottom: 2rem;
}

.form-group {
  text-align: left;
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: #475569;
}

input {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background-color: #f1f5f9;
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus {
  border-color: #4ade80;
  box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.2);
  outline: none;
}

.login-btn {
  width: 100%;
  background: #4ade80;
  color: white;
  font-weight: 600;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 8px;
  transition: background-color 0.25s ease;
}

.login-btn:hover {
  background: #22c55e;
  cursor: pointer;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
