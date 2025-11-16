import {
  $,
  component$,
  useSignal,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";

import "./app.css";
import { account, ID, type Models } from "./lib/appwrite";

export const App = component$(() => {
  const data = useStore({ name: "", email: "", password: "" });
  const user = useSignal<Models.User>();
  const isLoading = useSignal(true);

  const login = $(async (email: string, password: string) => {
    await account.createEmailPasswordSession({ email, password });
    user.value = await account.get();
  });

  const register = $(async () => {
    await account.create({
      userId: ID.unique(),
      ...data,
    });

    await login(data.email, data.password);
  });

  const logout = $(async () => {
    await account.deleteSession({ sessionId: "current" });
    user.value = undefined;
  });

  useVisibleTask$(
    async () => {
      if (user.value) return;
      try {
        user.value = await account.get();
      } catch (err) {}
      isLoading.value = false;
    },
    { strategy: "document-ready" }
  );
  return (
    <div>
      <h1>
        <span style={{ color: "#fd366e" }}>Appwrite</span> +{" "}
        <span style={{ color: "#18b6f6" }}>Qwik</span>
      </h1>
      {isLoading.value ? (
        <div>
          <p>Loading...</p>
        </div>
      ) : (
        <div>
          {user.value ? (
            <div>
              <p>Logged in as {user.value.name || user.value.email}</p>
              <button
                type="button"
                style={{ background: "red", color: "white" }}
                onClick$={logout}
              >
                Logout
              </button>
            </div>
          ) : (
            <form>
              <input
                type="email"
                placeholder="Email"
                value={data.email}
                onInput$={(_, el) => (data.email = el.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={data.password}
                onInput$={(_, el) => (data.password = el.value)}
                required
              />
              <input
                type="text"
                placeholder="Name"
                value={data.name}
                onInput$={(_, el) => (data.name = el.value)}
              />

              <button
                type="button"
                onClick$={async () => login(data.email, data.password)}
              >
                Login
              </button>

              <button type="button" onClick$={register}>
                Register
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
});
