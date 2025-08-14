/**
 * Bastyon SdkService: Simplified integration with Bastyon SDK.
 * Documentation: https://bastyon.com/application?id=app.pocketnet.docs&p=6465762f617070732f6d696e69617070732f73646b2e68746d6c
 *
 * For secure execution of payments and RPC calls, it is recommended to use the ready-to-use Express.js template:
 * https://github.com/DaniilKimlb/bastyon-miniapp-expressjs-template.
 * This template already includes the `pocketnet-proxy-api` library, simplifying interaction with the Bastyon API.
 */
export class SdkService {
  private static sdk: BastyonSdk | null = null;

  /**
   * Initializes the Bastyon SDK at the very start of the application lifecycle.
   * Must be called before any other SDK interactions.
   * Emits the `loaded` event to notify the platform that the application is ready.
   *
   * @example
   * await SdkService.init();
   */
  public static async init(): Promise<ApplicationInfo | null> {
    if (this.sdk) {
      console.warn("Bastyon SDK is already initialized.");
      return null;
    }

    try {
      this.sdk = new window.BastyonSdk();
      const sdkInfo = await this.sdk.init();
      this.sdk!.emit("loaded");
      console.log("Bastyon SDK successfully initialized.");
      return sdkInfo;
    } catch (error) {
      console.error("Error initializing Bastyon SDK:", error);
      throw error; // Re-throw error for handling at a higher level
    }
  }

  public static async requestPermissions() {
    const permissions = [
      "account",
      "zaddress",
      "geolocation",
      "messaging",
      "mobilecamera",
      "externallink",
      "chat",
    ];
    this.ensureInitialized();
    await this.checkAndRequestPermissions(permissions);

    /*await Promise.all(
      permissions.map(async (permission) => {
        const granted = await this.sdk!.permissions.check({ permission });

        if (!granted) {
          await this.sdk!.permissions.request([permission]);
        }
      })
    );*/
  }

  public static async getUsersInfo(): Promise<AccountInfo | null> {
    this.ensureInitialized();
    try {
      const account = await this.sdk!.get.account();
      console.log("account info", account);
      return account;
    } catch (error) {
      console.error("Ошибка запроса:", error);
      return null;
    }
  }

  /**
   * Ensures the SDK is initialized before calling other methods.
   * Throws an error if the SDK is not initialized.
   */
  private static ensureInitialized(): void {
    if (!this.sdk) {
      throw new Error(
        "Bastyon SDK is not initialized. Call SdkService.init() at the start of the application.",
      );
    }
  }

  /**
   * Opens an external link using the Bastyon platform.
   * @param url The URL to open.
   * @example
   * SdkService.openExternalLink('https://example.com');
   */
  public static openExternalLink(url: string): void {
    this.ensureInitialized();
    this.sdk!.openExternalLink(url).catch((error) => {
      console.error("Error opening external link:", error);
    });
  }

  /**
   * Example of an RPC call. It is recommended to use a server for secure execution.
   * @param method The RPC method to call.
   * @param parameters The parameters for the method.
   * @returns Promise<unknown> The result of the RPC call.
   * @example
   * SdkService.rpc('getnodeinfo').then((info) => console.log(info));
   */
  public static async rpc(
    method: string,
    parameters?: unknown[],
  ): Promise<unknown> {
    this.ensureInitialized();
    try {
      const result = await this.sdk!.rpc(method, parameters);
      return result;
    } catch (error) {
      console.error("Error during RPC call:", error);
      throw error;
    }
  }

  /**
   * Adds an event listener for a specific SDK event.
   * @param event The event name to listen to.
   * @param callback The callback function to handle the event data.
   * @example
   * SdkService.on('balance', (data) => console.log('Balance updated:', data));
   */
  public static on(
    event: BastyonSdkEvents,
    callback: (data: unknown) => void,
  ): void {
    this.ensureInitialized();
    this.sdk!.on(event, callback);
  }

  /**
   * Removes an event listener for a specific SDK event.
   * @param event The event name to remove the listener from.
   * @param callback The callback function to remove.
   * @example
   * const handler = (data) => console.log('Balance updated:', data);
   * SdkService.on('balance', handler);
   * SdkService.off('balance', handler);
   */
  public static off(
    event: BastyonSdkEvents,
    callback: (data: unknown) => void,
  ): void {
    this.ensureInitialized();
    this.sdk!.off(event, callback);
  }

  /**
   * Fetches application information from the Bastyon SDK.
   * @returns Promise<ApplicationInfo> The application information.
   * @example
   * SdkService.getAppInfo().then((info) => console.log('App info:', info));
   */
  public static async getAppInfo(): Promise<ApplicationInfo> {
    this.ensureInitialized();
    try {
      const info = await this.sdk!.get.appinfo();
      console.log("app info", info);
      return info;
    } catch (error) {
      console.error("Error fetching application information:", error);
      throw error;
    }
  }

  public static async getBalance(): Promise<unknown> {
    this.ensureInitialized();
    try {
      const info = await this.sdk!.get.balance();
      console.log("balance info", info);
      return info;
    } catch (error) {
      console.error("Error fetching balance information:", error);
      throw error;
    }
  }

  public static async getZaddress() {
    this.ensureInitialized();
    try {
      const address = await this.sdk!.get.zaddress();
      console.log("balance info", address);
      return address;
    } catch (error) {
      console.error("Error fetching zaddress", error);
      throw error;
    }
  }

  public static async getLocation() {
    this.ensureInitialized();
    try {
      const info = await this.sdk!.get.geolocation();
      console.log("geolocation info", info);
      return info;
    } catch (error) {
      console.error("Error fetching geo info", error);
      throw error;
    }
  }

  public static async showHelperMessage(message: string) {
    this.ensureInitialized();
    try {
      await this.sdk!.helpers.alert(message);
      // console.log("geolocation info", info);
    } catch (error) {
      console.error("Error helpers message", error);
      throw error;
    }
  }

  public static async getUserState() {
    this.ensureInitialized();
    try {
      const info = await this.sdk!.helpers.userstate();
      console.log("user state info", info);
    } catch (error) {
      console.error("Error helpers userState", error);
      throw error;
    }
  }

  /**
   * Checks and requests permissions.
   * @param permissions The list of permissions to check and request if needed.
   * @returns Promise<void>
   * @example
   * SdkService.checkAndRequestPermissions(['account', 'payment']);
   */
  public static async checkAndRequestPermissions(
    permissions: string[],
  ): Promise<void> {
    this.ensureInitialized();
    try {
      for (const permission of permissions) {
        const granted = await this.sdk!.permissions.check({ permission });
        if (!granted) await this.sdk!.permissions.request([permission]);
      }
      console.log("All required permissions granted:", permissions);
    } catch (error) {
      console.error("Error checking or requesting permissions:", error);
      throw error;
    }
  }
}
