import { defineComponent } from 'vue';
import { getPost, getEvents, getParty } from './PostCard';
import { getUser } from './UserData';
import Card from '@/components/profileComponents/PostCard.vue';
import UserProfile from '@/components/profileComponents/UserData.vue';

export default defineComponent({
  name: 'Profilo',
  components: { Card, UserProfile },
  data() {
    return {
      posts: [] as any[], 
      events: [] as any[],
      parties: [] as any[],
      userProfile: null as any | null,
    };
  },
  async created() {
    const id = this.$route.params.id as string;
    try {
      this.userProfile = await getUser(id);

      const [posts, events, parties] = await Promise.all([
        getPost(id),
        getEvents(id),
        getParty(id),
      ]);

      this.posts = posts;
      this.events = events;
      this.parties = parties;
    } catch (error) {
      console.error('Errore durante il caricamento del profilo o dei contenuti:', error);
    }
  },
});
